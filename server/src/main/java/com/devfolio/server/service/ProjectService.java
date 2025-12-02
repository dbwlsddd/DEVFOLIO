// server/src/main/java/com/devfolio/server/service/ProjectService.java
package com.devfolio.server.service;

import com.devfolio.server.domain.Member;
import com.devfolio.server.domain.Project;
import com.devfolio.server.dto.ProjectDto;
import com.devfolio.server.repository.MemberRepository;
import com.devfolio.server.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; // 추가
import java.util.ArrayList; // 추가

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final FileStorageService fileStorageService;

    // 프로젝트 목록 조회 (검색 기능 포함)
    public List<ProjectDto.Response> getProjects(String keyword, String type) {
        List<Project> projects;

        if (keyword == null || keyword.isBlank()) {
            projects = projectRepository.findAll();
        } else if ("stack".equalsIgnoreCase(type)) {
            projects = projectRepository.findByTechStackContaining(keyword);
        } else {
            projects = projectRepository.findByTitleContaining(keyword);
        }

        return projects.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // [추가됨] 내 프로젝트 목록 조회
    public List<ProjectDto.Response> getMyProjects(String username) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        // Member 엔티티가 이미 프로젝트 리스트를 가지고 있으므로 이를 활용
        return member.getProjects().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // [수정] 프로젝트 생성 (이미지 저장 로직 추가)
    @Transactional
    public ProjectDto.Response createProject(String username, ProjectDto.Request request, List<MultipartFile> images) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    imageUrls.add(fileStorageService.storeFile(file));
                }
            }
        }

        // 기술 스택 소문자 변환
        List<String> normalizedTechStack = request.getTechStack().stream()
                .map(String::trim).map(String::toLowerCase).collect(Collectors.toList());

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .githubUrl(request.getGithubUrl())
                .websiteUrl(request.getWebsiteUrl())
                .techStack(normalizedTechStack)
                .imageUrls(imageUrls) // 저장된 URL 리스트 사용
                .build();

        project.setMember(member);
        return convertToResponse(projectRepository.save(project));
    }

    // [수정] 프로젝트 수정 (이미지 추가/삭제 로직 포함)
    @Transactional
    public ProjectDto.Response updateProject(Long id, String username, ProjectDto.Request request, List<MultipartFile> newImages) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));

        if (!project.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        // 1. 기존 이미지 중 유지할 것만 남기고, 삭제된 것은 파일도 삭제
        List<String> remainingUrls = request.getImageUrls() != null ? request.getImageUrls() : new ArrayList<>();
        List<String> currentUrls = project.getImageUrls();

        // (삭제된 파일 정리: 현재 DB엔 있는데 요청엔 없는 것)
        for (String url : currentUrls) {
            if (!remainingUrls.contains(url)) {
                fileStorageService.deleteFile(url);
            }
        }

        // 2. 새 이미지 저장 및 추가
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile file : newImages) {
                if (!file.isEmpty()) {
                    remainingUrls.add(fileStorageService.storeFile(file));
                }
            }
        }

        List<String> normalizedTechStack = request.getTechStack().stream()
                .map(String::trim).map(String::toLowerCase).collect(Collectors.toList());

        // 3. 업데이트 수행 (Project 엔티티의 update 메소드 수정 필요 - imageUrls 인자 추가)
        project.update(request.getTitle(), request.getDescription(), normalizedTechStack, request.getGithubUrl(), request.getWebsiteUrl());
        project.setImageUrls(remainingUrls); // 이미지 리스트 갱신

        return convertToResponse(project);
    }

    // 프로젝트 삭제
    @Transactional
    public void deleteProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트가 존재하지 않습니다."));

        // 작성자 본인 확인
        if (!project.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        projectRepository.delete(project);
    }

    // (내부 헬퍼 메소드) Entity -> DTO 변환
    private ProjectDto.Response convertToResponse(Project p) {
        ProjectDto.Response dto = new ProjectDto.Response();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setGithubUrl(p.getGithubUrl());
        dto.setWebsiteUrl(p.getWebsiteUrl());
        dto.setTechStack(p.getTechStack());
        dto.setImageUrls(p.getImageUrls());

        if (p.getMember() != null) {
            dto.setMemberId(p.getMember().getId());
            dto.setAuthorName(p.getMember().getNickname());
            dto.setAuthorJob(p.getMember().getJobTitle());
        }
        return dto;
    }

    // 프로젝트 상세 조회
    public ProjectDto.Response getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        return convertToResponse(project);
    }
}