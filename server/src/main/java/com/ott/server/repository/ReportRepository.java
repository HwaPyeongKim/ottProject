package com.ott.server.repository;

import com.ott.server.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Integer> {
    boolean existsByBidxAndMidx(int bidx, int midx);
}
