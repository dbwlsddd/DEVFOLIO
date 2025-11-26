// Spring Boot Repository
package com.devfolio.server.repository;

import com.devfolio.server.domain.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    // CRUD 기능은 JpaRepository에 의해 자동으로 제공됩니다.
}