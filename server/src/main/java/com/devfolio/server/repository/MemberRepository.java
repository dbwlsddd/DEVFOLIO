package com.devfolio.server.repository;

import com.devfolio.server.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUsername(String username);
    boolean existsByUsername(String username);

    // [수정] List -> Page로 변경, Pageable 파라미터 추가
    Page<Member> findByTechStackContaining(String techStack, Pageable pageable);

    // 기본 검색(이름)
    Page<Member> findByNicknameContaining(String nickname, Pageable pageable);
}