package com.ott.server.repository;

import com.ott.server.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    int countByDbidxAndDeleteyn(int dbidx, String deleteyn);
    Page<Review> findAllByDbidxAndDeleteyn(int dbidx, String deleteyn, Pageable pageable);
    Review findByRidx(int ridx);

    @Query("SELECT COALESCE(AVG(r.score), 0) FROM Review r WHERE r.dbidx = :dbidx AND r.deleteyn = :deleteyn")
    double findAverageScoreByDbidxAndDeleteyn(@Param("dbidx") int dbidx, @Param("deleteyn") String deleteyn);

}
