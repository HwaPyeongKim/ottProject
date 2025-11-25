package com.ott.server.repository;

import com.ott.server.entity.Board;
import com.ott.server.entity.BoardStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Integer> {

//    @Query("SELECT b FROM Board b LEFT JOIN FETCH b.member ORDER BY b.writedate DESC ")
//    List<Board> findAllByOrderByWritedateDesc();

    Board findByBidx(int bidx);

    Page<Board> findAllByTitleContainingOrContentContainingOrBoardMember_NicknameContaining(String searchWord, String searchWord1, String searchWord2, Pageable pageable);

//    List<Board> findByTitleContainingOrContentContainingOrBoardMember_NicknameContaining(String searchWord, String searchWord1, String searchWord2);

    long countByTitleContainingOrContentContainingOrBoardMember_NicknameContaining(String searchWord, String searchWord1, String searchWord2);

    int countByStatus(BoardStatus status);

    Page<Board> findByStatus(BoardStatus status, Pageable pageable);

    @Query("SELECT b FROM Board b " + "WHERE b.status = :status " + "AND (b.title LIKE %:key% " + "OR b.content LIKE %:key% " + "OR b.boardMember.nickname LIKE %:key%)")
    Page<Board> searchByKeyAndStatus(@Param("status") BoardStatus status, @Param("key") String key, Pageable pageable);

    @Query("SELECT COUNT(b) FROM Board b " + "WHERE b.status = 'BLURRED' " + "AND (b.title LIKE %:key% " + "OR b.content LIKE %:key% " + "OR b.boardMember.nickname LIKE %:key%)")
    int countByKeyAndStatus(@Param("key") String key);

}
