package com.ott.server.repository;

import com.ott.server.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Integer> {

//    @Query("SELECT b FROM Board b LEFT JOIN FETCH b.member ORDER BY b.writedate DESC ")
//    List<Board> findAllByOrderByWritedateDesc();

    Board findByBidx(int bidx);

    List<Board> findByTitleContainingOrContentContainingOrBoardMember_NicknameContaining(String searchWord, String searchWord1, String searchWord2);

    Page<Board> findAllByTitleContainingOrContentContainingOrBoardMember_NicknameContaining(String searchWord, String searchWord1, String searchWord2, Pageable pageable);
}
