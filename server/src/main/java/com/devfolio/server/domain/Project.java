// server/src/main/java/com/devfolio/server/domain/Project.java
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

    private String title; // 프로젝트 제목

    @Column(length = 2000)
    private String description; // 프로젝트 설명

    private String githubUrl; // 깃허브 링크
    private String websiteUrl; // 배포 사이트 링크

    // 프로젝트에 사용된 기술 스택 (검색용)
    @ElementCollection
    private List<String> techStack;

    // 이미지 경로 리스트 (썸네일 등)
    @ElementCollection
    private List<String> imageUrls;

    // 작성자 (Member와 N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // 연관관계 편의 메소드 (작성자 설정 시 리스트에도 추가)
    public void setMember(Member member) {
        this.member = member;
        if (member != null && !member.getProjects().contains(this)) {
            member.getProjects().add(this);
        }
    }
}