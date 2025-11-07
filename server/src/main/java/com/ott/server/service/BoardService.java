package com.ott.server.service;

import com.ott.server.entity.Board;
import com.ott.server.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository br;

    public List<Board> getBoardList() {
        return br.findAllByOrderByWritedateDesc();
    }

    public Object insertBoard(Board board) {
        return br.save(board);
    }
}
