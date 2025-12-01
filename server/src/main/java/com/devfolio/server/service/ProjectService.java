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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;

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

    // 프로젝트 생성
    @Transactional
    public ProjectDto.Response createProject(String username, ProjectDto.Request request) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .githubUrl(request.getGithubUrl())
                .websiteUrl(request.getWebsiteUrl())
                .techStack(request.getTechStack())
                .imageUrls(request.getImageUrls())
                .build();

        project.setMember(member); // 연관관계 설정

        Project savedProject = projectRepository.save(project);
        return convertToResponse(savedProject);
    }

    // 프로젝트 삭제
    @Transactional
    public void deleteProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트가 존재하지 않습니다."));

        // 작성자 본인 확인
        if (!project.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다."); // Controller에서 403 처리 권장
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