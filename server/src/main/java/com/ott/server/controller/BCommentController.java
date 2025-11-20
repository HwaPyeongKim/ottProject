package com.ott.server.controller;

import com.ott.server.entity.BComment;
import com.ott.server.service.BCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("bcomment")
public class BCommentController {

    @Autowired
    BCommentService cs;

    @GetMapping("/getCommentList/{bidx}")
    public HashMap<String, Object> getCommentList(@PathVariable int bidx) {
        HashMap<String, Object> result = new HashMap<>();
        List<BComment> commentList = cs.getCommentList(bidx);
        result.put("commentList",  commentList);
        System.out.println("받은 bidx = " + bidx);

        return result;
    }

    @PostMapping("/addComment")
    public HashMap<String, Object> addComment(@RequestBody BComment bcomment) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            cs.addComment(bcomment);
            result.put("msg",  "ok");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("msg", "fail");
        }
        return result;
    }




}
