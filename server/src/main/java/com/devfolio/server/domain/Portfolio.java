// Spring Boot Entity (Domain)
package com.devfolio.server.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "portfolios") // 테이블 이름 명시
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String title;
    private String description;
    private String role;

    // 기술 스택을 별도의 컬렉션으로 저장 (별도의 테이블로 자동 생성됨)
    @ElementCollection
    private List<String> techStack;

    private Boolean featured;

    @Column(length = 1000)
    private String bio;
    private String github;
    private String website;

    // 프로젝트 목록 (JSON 형태로 저장하거나 별도 테이블로 매핑해야 하지만, 일단 단순화를 위해 String으로 처리)
    @Column(length = 2000)
    private String projectsJson; // 프로젝트 데이터를 JSON 문자열로 저장한다고 가정
}