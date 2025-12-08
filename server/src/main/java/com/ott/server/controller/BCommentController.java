package com.ott.server.controller;

import com.ott.server.dto.BCommentRequestDTO;
import com.ott.server.dto.BCommentResponseDTO;
import com.ott.server.dto.BReplyRequestDTO;
import com.ott.server.entity.BComment;
import com.ott.server.service.BCommentService;
import com.ott.server.service.BadWordFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("bcomment")
public class BCommentController {

    @Autowired
    BCommentService cs;

    @Autowired
    BadWordFilterService bws;

    @GetMapping("/getCommentList/{bidx}")
    public HashMap<String, Object> getCommentList(@PathVariable int bidx) {
        HashMap<String, Object> result = new HashMap<>();
        List<BCommentResponseDTO> commentList = cs.getCommentList(bidx);
        result.put("commentList",  commentList);
//        System.out.println("받은 bidx = " + bidx);
        return result;
    }

    @PostMapping("/addComment")
    public HashMap<String, Object> addComment(@RequestBody BCommentRequestDTO reqDto) {
        HashMap<String, Object> result = new HashMap<>();

        // 비속어 체크
        if (bws.containsBadWord(reqDto.getContent())) {
            result.put("msg", "비속어가 포함된 댓글은 작성할 수 없습니다.");
            return result;
        }

        try {
             cs.addComment(reqDto);
            result.put("msg",  "ok");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("msg", "fail");
        }
        return result;
    }

    @PostMapping("/addReply")
    public HashMap<String, Object> addReply(@RequestBody BReplyRequestDTO reqDto) {
        HashMap<String, Object> result = new HashMap<>();

        if (bws.containsBadWord(reqDto.getContent())) {
            result.put("msg", "비속어가 포함된 답글은 작성할 수 없습니다.");
            return result;
        }

        try {
            cs.addReply(reqDto);
            result.put("msg", "ok");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("msg", "fail");
        }
        return result;
    }

    @GetMapping("/getCommentCount/{bidx}")
    public HashMap<String, Object> getCommentCount(@PathVariable int bidx) {
        HashMap<String, Object> result = new HashMap<>();
        long count = cs.getCommentCount(bidx);
        result.put("count", count);
        return result;
    }


    @PostMapping("/updateReply/{bcidx}")
    public HashMap<String, Object> updateReply(@PathVariable int bcidx, @RequestBody HashMap<String, String> body) {
        HashMap<String, Object> result = new HashMap<>();

        if (bws.containsBadWord(body.get("content"))) {
            result.put("msg", "비속어가 포함된 댓글은 수정할 수 없습니다.");
            return result;
        }

        try {
            cs.updateReply(bcidx, body.get("content"));
            result.put("msg", "ok");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("msg", "fail");
        }
        return result;
    }

    @DeleteMapping("/deleteReply/{bcidx}")
    public HashMap<String, Object> deleteReply(@PathVariable int bcidx) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            cs.deleteReply(bcidx);
            result.put("msg", "ok");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("msg", "fail");
        }
        return result;
    }



}
