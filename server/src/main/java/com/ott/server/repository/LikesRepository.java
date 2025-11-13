package com.ott.server.repository;

import com.ott.server.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikesRepository extends JpaRepository<Likes, Integer> {
    Likes findByMidxAndDbidx(int midx, int dbidx);

    int countByDbidx(int dbidx);
}
