package com.devfolio.server.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
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

    @ElementCollection
    @Builder.Default
    private List<String> techStack = new ArrayList<>();

    @ElementCollection
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    @JsonIgnore
    private Member member;

    public void setMember(Member member) {
        this.member = member;
        if (member != null && !member.getProjects().contains(this)) {
            member.getProjects().add(this);
        }
    }

    // [추가] 정보 수정 메소드
    public void update(String title, String description, List<String> techStack, String githubUrl, String websiteUrl) {
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.githubUrl = githubUrl;
        this.websiteUrl = websiteUrl;
        // 이미지는 별도 로직이 필요할 수 있으므로 여기선 제외하거나 필요 시 추가
    }
}