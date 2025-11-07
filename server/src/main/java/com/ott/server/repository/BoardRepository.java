package com.ott.server.repository;

import com.ott.server.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Integer> {

    @Query("SELECT b FROM Board b JOIN FETCH b.member")
    List<Board> findAllWithMember();
}
