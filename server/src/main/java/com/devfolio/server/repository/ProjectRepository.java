package com.devfolio.server.repository;

import com.devfolio.server.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByMemberUsername(String username); // 내 프로젝트 보기
    // 기술 스택 검색 등 추가 가능
}