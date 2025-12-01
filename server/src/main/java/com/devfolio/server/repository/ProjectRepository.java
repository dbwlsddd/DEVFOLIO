// server/src/main/java/com/devfolio/server/repository/ProjectRepository.java
package com.devfolio.server.repository;

import com.devfolio.server.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // 내 프로젝트 목록 보기 (특정 회원의 프로젝트)
    List<Project> findByMemberUsername(String username);

    // [프로젝트 탐색] 제목으로 검색
    List<Project> findByTitleContaining(String keyword);

    // [프로젝트 탐색] 기술 스택으로 검색
    @Query("SELECT DISTINCT p FROM Project p JOIN p.techStack t WHERE t LIKE %:stack%")
    List<Project> findByTechStackContaining(@Param("stack") String stack);
}