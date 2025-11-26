// Spring Boot Controller (API Layer)
package com.devfolio.server.controller;

import com.devfolio.server.domain.Portfolio;
import com.devfolio.server.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Vite 서버(5173)에서 오는 요청 허용
public class PortfolioController {

    private final PortfolioRepository portfolioRepository;

    // 모든 포트폴리오 조회 (READ All)
    @GetMapping
    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    // 특정 포트폴리오 상세 조회 (READ One)
    @GetMapping("/{id}")
    public ResponseEntity<Portfolio> getPortfolio(@PathVariable Long id) {
        return portfolioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 포트폴리오 생성 (CREATE)
    @PostMapping
    public Portfolio createPortfolio(@RequestBody Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    // 포트폴리오 수정 (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Portfolio> updatePortfolio(@PathVariable Long id, @RequestBody Portfolio updatedPortfolio) {
        return portfolioRepository.findById(id)
                .map(portfolio -> {
                    portfolio.setName(updatedPortfolio.getName());
                    portfolio.setTitle(updatedPortfolio.getTitle());
                    portfolio.setDescription(updatedPortfolio.getDescription());
                    portfolio.setRole(updatedPortfolio.getRole());
                    portfolio.setTechStack(updatedPortfolio.getTechStack());
                    portfolio.setFeatured(updatedPortfolio.getFeatured());
                    portfolio.setBio(updatedPortfolio.getBio());
                    portfolio.setGithub(updatedPortfolio.getGithub());
                    portfolio.setWebsite(updatedPortfolio.getWebsite());
                    // projectsJson 필드는 생략 (복잡한 구조이므로)

                    return ResponseEntity.ok(portfolioRepository.save(portfolio));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 포트폴리오 삭제 (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        if (!portfolioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        portfolioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}