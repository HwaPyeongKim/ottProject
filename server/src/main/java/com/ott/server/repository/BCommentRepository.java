package com.ott.server.repository;

import com.ott.server.entity.BComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BCommentRepository extends JpaRepository<BComment, Integer> {

//    List<BComment> findByBoard_BidxOrderByBcidxDesc(int bidx);

    List<BComment> findByBoard_BidxAndDeleteynOrderByBcidxDesc(int bidx, String deleteyn);

}
