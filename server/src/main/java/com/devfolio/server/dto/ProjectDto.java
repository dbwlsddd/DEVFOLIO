// server/src/main/java/com/devfolio/server/dto/ProjectDto.java
package com.devfolio.server.dto;

import lombok.Data;
import java.util.List;

public class ProjectDto {

    @Data
    public static class Request {
        private String title;
        private String description;
        private String githubUrl;
        private String websiteUrl;
        private List<String> techStack;
        private List<String> imageUrls;
    }

    // Response DTO에 필드 추가
    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String githubUrl;
        private String websiteUrl;
        private List<String> techStack;
        private List<String> imageUrls;

        private Long memberId;
        private String authorName;
        private String authorJob;

        // [추가된 필드]
        private Long viewCount;
        private Integer likeCount;
        private boolean isLiked; // 현재 로그인한 사용자가 좋아요를 눌렀는지 여부
    }
}