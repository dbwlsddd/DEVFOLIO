// server/src/main/java/com/devfolio/server/controller/MemberController.java
package com.devfolio.server.controller;

import com.devfolio.server.domain.Member;
import com.devfolio.server.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // [개발자 탐색] 전체 조회 및 검색
    @GetMapping
    public List<Member> getMembers(@RequestParam(required = false) String keyword,
                                   @RequestParam(required = false, defaultValue = "name") String type) {
        return memberService.getMembers(keyword, type);
    }

    // [상세 조회] 특정 개발자 정보
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMember(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMember(id));
    }

    // [내 정보 수정]
    @PutMapping("/me")
    public ResponseEntity<Member> updateMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                  @RequestBody Member updateData) {
        return ResponseEntity.ok(memberService.updateMyProfile(userDetails.getUsername(), updateData));
    }
}