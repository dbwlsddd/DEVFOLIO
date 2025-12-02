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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page; // 추가
import org.springframework.data.domain.Pageable; // 추가

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final FileStorageService fileStorageService;

    // [수정] 프로젝트 목록 조회 (Pageable 추가, 반환 타입 Page로 변경)
    public Page<ProjectDto.Response> getProjects(String keyword, String type, Pageable pageable) {
        Page<Project> projectPage;

        if (keyword == null || keyword.isBlank()) {
            projectPage = projectRepository.findAll(pageable);
        } else if ("stack".equalsIgnoreCase(type)) {
            projectPage = projectRepository.findByTechStackContaining(keyword, pageable);
        } else {
            projectPage = projectRepository.findByTitleContaining(keyword, pageable);
        }

        // Page<Entity> -> Page<Dto> 변환 (map 함수 사용)
        return projectPage.map(this::convertToResponse);
    }

    // 내 프로젝트 목록 조회
    public List<ProjectDto.Response> getMyProjects(String username) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        return member.getProjects().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 프로젝트 상세 조회 (조회수 증가 + 좋아요 여부 확인)
    @Transactional
    public ProjectDto.Response getProject(Long id, String username) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));

        // 조회수 증가
        project.setViewCount(project.getViewCount() + 1);

        return convertToResponse(project, username);
    }

    // 프로젝트 생성 (이미지 저장 로직 포함)
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
                .imageUrls(imageUrls)
                .build();

        project.setMember(member);
        return convertToResponse(projectRepository.save(project));
    }

    // 프로젝트 수정 (이미지 추가/삭제 로직 포함)
    @Transactional
    public ProjectDto.Response updateProject(Long id, String username, ProjectDto.Request request, List<MultipartFile> newImages) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));

        if (!project.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        // 1. 이미지 처리 (삭제된 파일 정리)
        List<String> remainingUrls = request.getImageUrls() != null ? request.getImageUrls() : new ArrayList<>();
        List<String> currentUrls = project.getImageUrls();

        for (String url : currentUrls) {
            if (!remainingUrls.contains(url)) {
                fileStorageService.deleteFile(url);
            }
        }

        // 2. 새 이미지 저장
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile file : newImages) {
                if (!file.isEmpty()) {
                    remainingUrls.add(fileStorageService.storeFile(file));
                }
            }
        }

        // 3. 정보 업데이트
        List<String> normalizedTechStack = request.getTechStack().stream()
                .map(String::trim).map(String::toLowerCase).collect(Collectors.toList());

        project.update(request.getTitle(), request.getDescription(), normalizedTechStack, request.getGithubUrl(), request.getWebsiteUrl());
        project.setImageUrls(remainingUrls);

        return convertToResponse(project);
    }

    // 프로젝트 삭제
    @Transactional
    public void deleteProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트가 존재하지 않습니다."));

        if (!project.getMember().getUsername().equals(username)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        // 프로젝트 삭제 시 연결된 이미지 파일들도 로컬 스토리지에서 삭제
        project.getImageUrls().forEach(fileStorageService::deleteFile);

        projectRepository.delete(project);
    }

    // 좋아요 토글 기능
    @Transactional
    public void toggleLike(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));

        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        if (project.getLikes().contains(member)) {
            project.getLikes().remove(member);
        } else {
            project.getLikes().add(member);
        }
    }

    // [개선됨] DTO 변환 메소드 통합 (중복 제거)
    // 1. username이 없는 경우 (목록 조회용) -> null을 넘겨서 재사용
    private ProjectDto.Response convertToResponse(Project p) {
        return convertToResponse(p, null);
    }

    // 2. username이 있는 경우 (상세 조회용, 좋아요 여부 확인)
    private ProjectDto.Response convertToResponse(Project p, String currentUsername) {
        ProjectDto.Response dto = new ProjectDto.Response();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setGithubUrl(p.getGithubUrl());
        dto.setWebsiteUrl(p.getWebsiteUrl());
        dto.setTechStack(p.getTechStack());
        dto.setImageUrls(p.getImageUrls());

        // 통계 정보 설정 (목록/상세 모두 포함됨)
        dto.setViewCount(p.getViewCount());
        dto.setLikeCount(p.getLikes().size());

        // 좋아요 여부 확인
        if (currentUsername != null) {
            boolean liked = p.getLikes().stream()
                    .anyMatch(m -> m.getUsername().equals(currentUsername));
            dto.setLiked(liked);
        } else {
            dto.setLiked(false);
        }

        if (p.getMember() != null) {
            dto.setMemberId(p.getMember().getId());
            dto.setAuthorName(p.getMember().getNickname());
            dto.setAuthorJob(p.getMember().getJobTitle());
        }
        return dto;
    }
}