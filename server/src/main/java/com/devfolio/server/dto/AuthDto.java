// server/src/main/java/com/devfolio/server/dto/AuthDto.java
package com.devfolio.server.dto;

import lombok.Data;
import java.util.List;

public class AuthDto {

    @Data
    public static class SignupRequest {
        private String username;
        private String password;
        private String nickname;
        // 가입 시 입력받을 추가 정보 (선택 사항)
        private String jobTitle;
        private String bio;
        private String githubUrl;
        private List<String> techStack;
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class TokenResponse {
        private String token;
        private String type = "Bearer";
        private Long memberId;      // 프론트에서 내 페이지 갈 때 필요
        private String username;
        private String nickname;

        public TokenResponse(String token, Long memberId, String username, String nickname) {
            this.token = token;
            this.memberId = memberId;
            this.username = username;
            this.nickname = nickname;
        }
    }
}