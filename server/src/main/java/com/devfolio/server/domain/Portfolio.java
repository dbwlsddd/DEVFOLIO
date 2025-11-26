package com.devfolio.server.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title;
    private String description;
    private String role;

    // 기술 스택은 간단하게 문자열 리스트로 저장 (별도 테이블로 분리할 수도 있음)
    @ElementCollection
    private List<String> techStack;

    private boolean featured;

    // 상세 페이지용 필드 추가
    @Column(length = 1000)
    private String bio;
    private String github;
    private String website;
}