package com.ott.server.repository;

import com.ott.server.entity.BLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BLikesRepository extends JpaRepository<BLikes, Integer> {

    List<BLikes> findByBidx(int boardid);

    Optional<BLikes> findByBlidx(int blidx);

    BLikes findByMidxAndBidx(int midx, int bidx);
}
