package com.ott.server.repository;

import com.ott.server.entity.Member;
import com.ott.server.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

//    Page<Review> findByMidx(int midx, Pageable pageable);
//
//    List<Review> findAllByMidx(int midx, Sort writedate);
//
//    int countByMidx(int midx);

    Review findByDbidxAndSeasonAndMidxAndDeleteyn(int dbidx, int season, int midx, String n);

//    List<Review> findAllByMidxAndType(int midx, String type, Sort writedate);
//
//    int countByMidxAndType(int midx, String type);
//
//    Page<Review> findByMidxAndType(int midx, String type, Pageable pageable);

    List<Review> findAllByMidxAndTypeAndDeleteyn(int midx, String type, String deleteYn, Sort writedate);

    List<Review> findAllByMidxAndDeleteyn(int midx, String deleteYn, Sort writedate);

    int countByMidxAndTypeAndDeleteyn(int midx, String type, String deleteYn);

    int countByMidxAndDeleteyn(int midx, String deleteYn);

    Page<Review> findByMidxAndTypeAndDeleteyn(int midx, String type, String deleteYn, Pageable pageable);

    Page<Review> findByMidxAndDeleteyn(int midx, String deleteYn, Pageable pageable);

    List<Review> findByMember_Midx(int midx);
}
