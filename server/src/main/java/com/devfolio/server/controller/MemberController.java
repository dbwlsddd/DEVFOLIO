package com.devfolio.server.controller;

import com.devfolio.server.domain.Member;
import com.devfolio.server.dto.MemberDto; // Import DTO
import com.devfolio.server.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // [수정] 개발자 탐색 (페이지네이션 적용, 반환타입 Page<MemberDto.Response>)
    @GetMapping
    public Page<MemberDto.Response> getMembers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "name") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        // 최신 가입순(id 내림차순) 정렬
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return memberService.getMembers(keyword, type, pageable);
    }

    // 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<Member> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(memberService.getMyProfile(userDetails.getUsername()));
    }

    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMember(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMember(id));
    }

    // 내 정보 수정
    @PutMapping("/me")
    public ResponseEntity<Member> updateMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                  @RequestBody Member updateData) {
        return ResponseEntity.ok(memberService.updateMyProfile(userDetails.getUsername(), updateData));
    }
}