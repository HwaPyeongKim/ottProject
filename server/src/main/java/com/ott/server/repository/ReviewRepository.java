package com.ott.server.repository;

import com.ott.server.entity.Board;
import com.ott.server.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    int countByDbidxAndSeasonAndDeleteynAndContentIsNotNullAndContentNot(int dbidx, int season, String deleteyn, String s);
    Page<Review> findAllByDbidxAndSeasonAndDeleteynAndContentIsNotNullAndContentNot(int dbidx, int season, String deleteyn, String s, Pageable pageable);
    Review findByRidx(int ridx);

    @Query("SELECT COALESCE(AVG(r.score), 0) FROM Review r WHERE r.dbidx = :dbidx AND r.season = :season AND r.deleteyn = :deleteyn")
    double findAverageScoreByDbidxAndSeasonAndDeleteyn(@Param("dbidx") int dbidx, @Param("season") int season, @Param("deleteyn") String deleteyn);

    int countByIsspoil(String isspoil);

    Page<Review> findByIsspoil(String isspoil, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Review r " + "WHERE r.isspoil = 'Y' AND r.content LIKE %:key%")
    int countByKeyAndIsspoil(String key);

    @Query("SELECT r FROM Review r " + "WHERE r.isspoil = 'Y' AND r.content LIKE %:key%")
    Page<Review> searchByKeyAndIsspoil(String key, Pageable pageable);
}
