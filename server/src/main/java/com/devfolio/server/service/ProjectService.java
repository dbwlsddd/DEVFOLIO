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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final FileService fileService;

    @Transactional
    public void createProject(String username, ProjectDto request, List<MultipartFile> images) throws IOException {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        List<String> imagePaths = new ArrayList<>();
        if (images != null) {
            for (MultipartFile img : images) {
                String path = fileService.saveFile(img);
                if (path != null) imagePaths.add(path);
            }
        }

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .githubUrl(request.getGithubUrl())
                .websiteUrl(request.getWebsiteUrl())
                .techStack(request.getTechStack())
                .imageUrls(imagePaths)
                .member(member)
                .build();

        projectRepository.save(project);
    }

    // 전체 조회 (다른 사람 것 포함)
    public List<ProjectDto.Response> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // 내 프로젝트 조회
    public List<ProjectDto.Response> getMyProjects(String username) {
        return projectRepository.findByMemberUsername(username).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // DTO 변환기
    private ProjectDto.Response toResponse(Project p) {
        ProjectDto.Response res = new ProjectDto.Response();
        res.setId(p.getId());
        res.setTitle(p.getTitle());
        res.setDescription(p.getDescription());
        res.setGithubUrl(p.getGithubUrl());
        res.setWebsiteUrl(p.getWebsiteUrl());
        res.setTechStack(p.getTechStack());
        res.setImageUrls(p.getImageUrls());
        res.setAuthorName(p.getMember().getNickname());
        return res;
    }
}