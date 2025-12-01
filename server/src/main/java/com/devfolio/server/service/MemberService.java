// server/src/main/java/com/devfolio/server/service/MemberService.java
package com.devfolio.server.service;

import com.devfolio.server.domain.Member;
import com.devfolio.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    // 개발자 목록 조회 (검색 기능 포함)
    public List<Member> getMembers(String keyword, String type) {
        if (keyword == null || keyword.isBlank()) {
            return memberRepository.findAll();
        }

        if ("stack".equalsIgnoreCase(type)) {
            return memberRepository.findByTechStackContaining(keyword);
        } else {
            return memberRepository.findByNicknameContaining(keyword); // 기본은 이름 검색
        }
    }

    // 특정 개발자 상세 조회
    public Member getMember(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }

    // 내 정보 수정
    @Transactional
    public Member updateMyProfile(String username, Member updateData) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // 변경 감지(Dirty Checking)를 통해 save 호출 없이도 트랜잭션 종료 시 업데이트됨
        member.setNickname(updateData.getNickname());
        member.setJobTitle(updateData.getJobTitle());
        member.setBio(updateData.getBio());
        member.setGithubUrl(updateData.getGithubUrl());
        member.setBlogUrl(updateData.getBlogUrl());
        member.setTechStack(updateData.getTechStack());

        return member;
    }
}