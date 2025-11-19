package com.ott.server.repository;

import com.ott.server.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikesRepository extends JpaRepository<Likes, Integer> {
    Likes findByMidxAndDbidxAndSeason(int midx, int dbidx, int season);
    int countByDbidxAndSeason(int dbidx, int season);
    List<Likes> findAllByMidx(int midx);
}
