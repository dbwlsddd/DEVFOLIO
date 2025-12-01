package com.devfolio.server.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProjectDto {
    // 등록/수정 요청용
    private String title;
    private String description;
    private String githubUrl;
    private String websiteUrl;
    private List<String> techStack; // "React", "Spring" 등

    // 조회 응답용 (Response)
    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String githubUrl;
        private String websiteUrl;
        private List<String> techStack;
        private List<String> imageUrls;
        private String authorName; // 작성자 닉네임
    }
}