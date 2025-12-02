package com.devfolio.server.repository;

import com.devfolio.server.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // [수정] 반환 타입 List -> Page, 파라미터에 Pageable 추가
    Page<Project> findByTechStackContaining(String techStack, Pageable pageable);

    Page<Project> findByTitleContaining(String title, Pageable pageable);

    // findAll(Pageable)은 JpaRepository에 이미 포함되어 있어서 추가 안 해도 됨
}