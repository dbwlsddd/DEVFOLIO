package com.devfolio.server.service;

import com.devfolio.server.domain.Member;
import com.devfolio.server.dto.MemberDto; // Import DTO
import com.devfolio.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    // [수정] 개발자 목록 조회 (페이지네이션 및 DTO 변환 적용)
    public Page<MemberDto.Response> getMembers(String keyword, String type, Pageable pageable) {
        Page<Member> memberPage;

        if (keyword == null || keyword.isBlank()) {
            memberPage = memberRepository.findAll(pageable);
        } else if ("stack".equalsIgnoreCase(type)) {
            memberPage = memberRepository.findByTechStackContaining(keyword, pageable);
        } else {
            memberPage = memberRepository.findByNicknameContaining(keyword, pageable);
        }

        // Entity -> DTO 변환
        return memberPage.map(this::convertToResponse);
    }

    // [추가] DTO 변환 헬퍼 메소드
    private MemberDto.Response convertToResponse(Member m) {
        MemberDto.Response dto = new MemberDto.Response();
        dto.setId(m.getId());
        dto.setNickname(m.getNickname());
        dto.setJobTitle(m.getJobTitle());
        dto.setBio(m.getBio());
        dto.setGithubUrl(m.getGithubUrl());
        dto.setBlogUrl(m.getBlogUrl());
        dto.setTechStack(m.getTechStack());
        return dto;
    }

    // [추가] 내 정보 조회 시에도 DTO 반환 (선택 사항이나 일관성을 위해 추천)
    public Member getMyProfile(String username) {
        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));
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

        List<String> normalizedTechStack = updateData.getTechStack().stream()
                .map(String::trim).map(String::toLowerCase).collect(java.util.stream.Collectors.toList());

        member.setNickname(updateData.getNickname());
        member.setJobTitle(updateData.getJobTitle());
        member.setBio(updateData.getBio());
        member.setGithubUrl(updateData.getGithubUrl());
        member.setBlogUrl(updateData.getBlogUrl());
        member.setTechStack(normalizedTechStack);

        return member;
    }
}