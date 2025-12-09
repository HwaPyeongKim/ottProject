package com.ott.server.repository;

import com.ott.server.entity.BComment;
import com.ott.server.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BCommentRepository extends JpaRepository<BComment, Integer> {

//    List<BComment> findByBoard_BidxOrderByBcidxDesc(int bidx);

    List<BComment> findByBoard_BidxAndDeleteynOrderByBcidxDesc(int bidx, String deleteyn);

    @Query("select c from BComment c join fetch c.member where c.board = :board order by c.bcidx desc")
    List<BComment> findAllByBoardWithMember(@Param("board") Board board);

    @Query("SELECT COUNT(c) FROM BComment c WHERE c.board.bidx = :bidx")
    long countByBoardId(int bidx);

//    List<BComment> findByPcidx(int bcidx);
    List<BComment> findByPcidxAndDeleteyn(int bcidx, String deleteyn);

    List<BComment> findByBoard(Board board);

    List<BComment> findByMember_Midx(int midx);
//    List<BComment> findAllByBoard(Board boardEntity);
}
