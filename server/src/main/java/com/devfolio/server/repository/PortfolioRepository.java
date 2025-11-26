package com.devfolio.server.repository;

import com.devfolio.server.domain.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    // 필요한 경우 커스텀 쿼리 메소드 추가
}