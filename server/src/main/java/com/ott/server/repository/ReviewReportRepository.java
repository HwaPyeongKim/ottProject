package com.ott.server.repository;

import com.ott.server.entity.ReviewReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewReportRepository extends JpaRepository<ReviewReport, Integer> {
    ReviewReport findByRidxAndMidx(int ridx, int midx);
    int countByRidx(int ridx);

}
