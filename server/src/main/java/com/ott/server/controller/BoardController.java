package com.ott.server.controller;

import com.ott.server.entity.Board;
import com.ott.server.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/board")
public class BoardController {

    @Autowired
    BoardService bs;

    @GetMapping("/getBoardList")
    public HashMap<String, Object> getBoardList(){
        HashMap<String, Object> result = new HashMap<>();
        result.put("boardList", bs.getBoardList());
        return result;
    }

    @PostMapping("/writeForm")
    public HashMap<String, Object> writeForm(@RequestBody Board board){
        HashMap<String, Object> result = new HashMap<>();
        result.put("board", bs.insertBoard(board));
        return result;
    }

}
