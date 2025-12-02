// server/src/main/java/com/devfolio/server/controller/ProjectController.java
package com.devfolio.server.controller;

import com.devfolio.server.dto.ProjectDto;
import com.devfolio.server.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // [프로젝트 탐색] 전체 조회 및 검색
    @GetMapping
    public List<ProjectDto.Response> getProjects(@RequestParam(required = false) String keyword,
                                                 @RequestParam(required = false, defaultValue = "title") String type) {
        return projectService.getProjects(keyword, type);
    }

    // [추가됨] 내 프로젝트 조회
    // 주의: @GetMapping("/{id}") 보다 위에 위치해야 안전하게 라우팅됩니다.
    @GetMapping("/my")
    public List<ProjectDto.Response> getMyProjects(@AuthenticationPrincipal UserDetails userDetails) {
        return projectService.getMyProjects(userDetails.getUsername());
    }

    // [수정] 프로젝트 등록 (파일 업로드 지원)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProjectDto.Response> createProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("data") ProjectDto.Request request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return ResponseEntity.ok(projectService.createProject(userDetails.getUsername(), request, images));
    }

    // [수정] 프로젝트 수정 (파일 업로드 지원)
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProjectDto.Response> updateProject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("data") ProjectDto.Request request,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages) {
        return ResponseEntity.ok(projectService.updateProject(id, userDetails.getUsername(), request, newImages));
    }

    // [프로젝트 삭제]
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        projectService.deleteProject(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // 프로젝트 상세 조회 API
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto.Response> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }
}