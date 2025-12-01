package com.devfolio.server.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username; // 아이디

    @Column(nullable = false)
    private String password; // 비밀번호 (암호화 저장)

    @Column(nullable = false)
    private String nickname; // 닉네임

    private String jobTitle; // 직군 (예: Backend Developer)

    @Column(length = 1000)
    private String bio; // 자기소개

    private String githubUrl;
    private String profileImage; // 프로필 이미지 파일 경로

    // 회원이 가진 기술 스택 (예: "Java,Spring,React" 콤마로 구분하거나 별도 테이블)
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> techStack = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role; // USER, ADMIN

    public enum Role {
        USER, ADMIN
    }
}