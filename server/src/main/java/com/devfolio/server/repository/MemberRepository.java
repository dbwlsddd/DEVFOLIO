// server/src/main/java/com/devfolio/server/repository/MemberRepository.java
package com.devfolio.server.repository;

import com.devfolio.server.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 로그인/회원가입용
    Optional<Member> findByUsername(String username);
    boolean existsByUsername(String username);

    // [개발자 탐색] 닉네임으로 검색 (부분 일치)
    List<Member> findByNicknameContaining(String keyword);

    // [개발자 탐색] 기술 스택으로 검색 (해당 스택을 가진 개발자 찾기)
    @Query("SELECT DISTINCT m FROM Member m JOIN m.techStack t WHERE t LIKE %:stack%")
    List<Member> findByTechStackContaining(@Param("stack") String stack);
}