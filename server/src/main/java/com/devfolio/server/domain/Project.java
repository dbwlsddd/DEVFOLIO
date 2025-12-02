package com.devfolio.server.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String githubUrl;
    private String websiteUrl;

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

    // [추가] 조회수 (기본값 0)
    @Column(columnDefinition = "bigint default 0")
    @Builder.Default
    private Long viewCount = 0L;

    // [추가] 좋아요 (다대다 관계: 한 프로젝트를 여러 회원이 좋아할 수 있음)
    @ManyToMany
    @JoinTable(
            name = "project_likes",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    @Builder.Default
    private Set<Member> likes = new HashSet<>();

    public void setMember(Member member) {
        this.member = member;
        if (member != null && !member.getProjects().contains(this)) {
            member.getProjects().add(this);
        }
    }

    public void update(String title, String description, List<String> techStack, String githubUrl, String websiteUrl) {
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.githubUrl = githubUrl;
        this.websiteUrl = websiteUrl;
    }
}