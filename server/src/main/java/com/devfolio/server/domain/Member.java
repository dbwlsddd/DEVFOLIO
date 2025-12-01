// server/src/main/java/com/devfolio/server/domain/Member.java
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

    // --- 로그인 계정 정보 ---
    @Column(unique = true, nullable = false)
    private String username; // 아이디 (로그인용)

    @Column(nullable = false)
    private String password; // 비밀번호

    @Column(nullable = false)
    private String nickname; // 사용자 이름 (표시용)

    @Enumerated(EnumType.STRING)
    private Role role; // USER, ADMIN

    // --- 포트폴리오 프로필 정보 (기존 Portfolio 내용 통합) ---
    private String jobTitle; // 직군 (예: Backend Developer)

    @Column(length = 1000)
    private String bio; // 한 줄 소개

    private String githubUrl;
    private String blogUrl; // 웹사이트/블로그 링크

    // 개발자의 주 기술 스택 (예: Java, Spring, React)
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> techStack = new ArrayList<>();

    // --- 연관 관계 ---
    // 회원이 삭제되면 작성한 프로젝트도 같이 삭제 (CascadeType.ALL)
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projects = new ArrayList<>();

    public enum Role {
        USER, ADMIN
    }
}