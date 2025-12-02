// server/src/main/java/com/devfolio/server/service/AuthService.java
package com.devfolio.server.service;

import com.devfolio.server.domain.Member;
import com.devfolio.server.dto.AuthDto;
import com.devfolio.server.repository.MemberRepository;
import com.devfolio.server.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본적으로 읽기 전용, 쓰기 작업에만 @Transactional 붙임
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    // 기존 signup 메서드 내부 수정
    @Transactional
    public void signup(AuthDto.SignupRequest request) {
        if (memberRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 회원입니다.");
        }

        // [수정] 기술 스택 소문자 변환 및 공백 제거
        List<String> normalizedTechStack = request.getTechStack().stream()
                .map(String::trim)        // 앞뒤 공백 제거
                .map(String::toLowerCase) // 소문자로 변환
                .collect(Collectors.toList());

        Member member = Member.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .jobTitle(request.getJobTitle())
                .techStack(normalizedTechStack) // [수정] 변환된 리스트 사용
                .role(Member.Role.USER)
                .build();

        memberRepository.save(member);
    }

    // 로그인
    public AuthDto.TokenResponse login(AuthDto.LoginRequest request) {
        Member member = memberRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 아이디입니다."));

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.createToken(
                member.getUsername(),
                Collections.singletonList(member.getRole().name())
        );

        return new AuthDto.TokenResponse(token, member.getId(), member.getUsername(), member.getNickname());
    }
}