package com.devfolio.server.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // 프로젝트 이름

    @Column(length = 2000)
    private String description; // 프로젝트 설명

    private String githubUrl; // 깃허브 링크
    private String websiteUrl; // 배포 사이트 링크

    // 프로젝트에 사용된 기술 스택
    @ElementCollection
    private List<String> techStack;

    // 이미지 파일 경로 리스트
    @ElementCollection
    private List<String> imageUrls;

    // 첨부 파일 경로 (하나만 가능하다고 가정, 필요시 리스트로 변경)
    private String filePath;

    // 작성자 (Member와 N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
}