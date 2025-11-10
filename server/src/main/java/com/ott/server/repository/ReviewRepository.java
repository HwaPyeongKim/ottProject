package com.ott.server.repository;

import com.ott.server.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findAllByDbidxAndDeleteynOrderByWritedateDesc(int dbidx, String deleteyn);
}
