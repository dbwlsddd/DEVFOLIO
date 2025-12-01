// server/src/main/java/com/devfolio/server/controller/ProjectController.java
package com.devfolio.server.controller;

import com.devfolio.server.dto.ProjectDto;
import com.devfolio.server.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    // [프로젝트 등록]
    @PostMapping
    public ResponseEntity<ProjectDto.Response> createProject(@AuthenticationPrincipal UserDetails userDetails,
                                                             @RequestBody ProjectDto.Request request) {
        return ResponseEntity.ok(projectService.createProject(userDetails.getUsername(), request));
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