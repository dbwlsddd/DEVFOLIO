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
import org.springframework.data.domain.Page; // 추가
import org.springframework.data.domain.PageRequest; // 추가
import org.springframework.data.domain.Sort; // 추가
import org.springframework.data.domain.Pageable; // 추가

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // [수정] 프로젝트 탐색 (페이지네이션 적용)
    @GetMapping
    public Page<ProjectDto.Response> getProjects(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "title") String type,
            @RequestParam(defaultValue = "0") int page,  // 페이지 번호 (0부터 시작)
            @RequestParam(defaultValue = "9") int size   // 한 페이지에 보여줄 개수
    ) {
        // 최신순(id 내림차순) 정렬
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return projectService.getProjects(keyword, type, pageable);
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

    // [수정] 프로젝트 상세 조회 (로그인 여부에 따라 정보가 달라짐)
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto.Response> getProject(@PathVariable Long id,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : null;
        return ResponseEntity.ok(projectService.getProject(id, username));
    }

    // [추가] 좋아요 토글 API
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        projectService.toggleLike(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}