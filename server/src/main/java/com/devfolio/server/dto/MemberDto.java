package com.devfolio.server.dto;

import lombok.Data;
import java.util.List;

public class MemberDto {

    @Data
    public static class Response {
        private Long id;
        private String nickname;
        private String jobTitle;
        private String bio;
        private String githubUrl;
        private String blogUrl;
        private List<String> techStack;
        // projects 리스트는 제외하여 성능 최적화 및 오류 방지
    }
}