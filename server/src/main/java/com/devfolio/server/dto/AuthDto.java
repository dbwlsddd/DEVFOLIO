package com.devfolio.server.dto;

import lombok.Data;

public class AuthDto {

    @Data
    public static class SignupRequest {
        private String username;
        private String password;
        private String nickname;
        private String jobTitle;
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class TokenResponse {
        private String token;
        private String username;
        private String nickname;

        public TokenResponse(String token, String username, String nickname) {
            this.token = token;
            this.username = username;
            this.nickname = nickname;
        }
    }
}