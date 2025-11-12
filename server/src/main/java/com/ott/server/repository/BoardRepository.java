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

    List<Board> findByTitleContainingOrContentContaining(String title, String content);
    Page<Board> findAllByTitleContainingOrContentContaining(String title, String content,  Pageable pageable);
}
