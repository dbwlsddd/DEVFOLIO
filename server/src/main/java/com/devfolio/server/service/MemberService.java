package com.devfolio.server.service;

import com.devfolio.server.domain.Member;
import com.devfolio.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
            return memberRepository.findByNicknameContaining(keyword);
        }
    }

    // [추가됨] 내 정보 조회 (Username으로 조회)
    public Member getMyProfile(String username) {
        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));
    }

    // 특정 개발자 상세 조회 (ID로 조회)
    public Member getMember(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }

    // 내 정보 수정
    // 기존 updateMyProfile 메서드 내부 수정
    @Transactional
    public Member updateMyProfile(String username, Member updateData) {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        // [수정] 기술 스택 소문자 변환 및 공백 제거
        List<String> normalizedTechStack = updateData.getTechStack().stream()
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        member.setNickname(updateData.getNickname());
        member.setJobTitle(updateData.getJobTitle());
        member.setBio(updateData.getBio());
        member.setGithubUrl(updateData.getGithubUrl());
        member.setBlogUrl(updateData.getBlogUrl());

        member.setTechStack(normalizedTechStack); // [수정] 변환된 리스트 저장

        return member;
    }
}