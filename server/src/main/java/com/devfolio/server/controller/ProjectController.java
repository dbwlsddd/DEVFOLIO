package com.devfolio.server.controller;

import com.devfolio.server.dto.ProjectDto;
import com.devfolio.server.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    // 프로젝트 등록 (파일 업로드 포함)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createProject(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("data") ProjectDto request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        if (userDetails == null) return ResponseEntity.status(401).body("로그인이 필요합니다.");
        projectService.createProject(userDetails.getUsername(), request, images);
        return ResponseEntity.ok("프로젝트 등록 성공");
    }

    // 전체 조회 (Resources 메뉴용)
    @GetMapping
    public List<ProjectDto.Response> getAllProjects() {
        return projectService.getAllProjects();
    }

    // 내 프로젝트 조회 (My Page용)
    @GetMapping("/my")
    public List<ProjectDto.Response> getMyProjects(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) throw new RuntimeException("로그인이 필요합니다.");
        return projectService.getMyProjects(userDetails.getUsername());
    }
}