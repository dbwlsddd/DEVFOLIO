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

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String githubUrl;
        private String websiteUrl;
        private List<String> techStack;
        private List<String> imageUrls;

        // 작성자 정보 (카드 UI에 표시할 것들)
        private Long memberId;
        private String authorName;
        private String authorJob;
    }
}