package com.ott.server.controller;

import com.ott.server.entity.Member;
import com.ott.server.entity.Qna;
import com.ott.server.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    AdminService as;

    @GetMapping("/getQnaList")
    public HashMap<String, Object> getQnaList(@RequestParam("page") int page,
                                              @RequestParam(value="key", required = false, defaultValue = "") String key){
        System.out.println("✅ getQnaList 호출됨");
        return as.getQnaList(page, key);
    }

    @GetMapping("/getMyQnaList")
    public HashMap<String, Object> getMyQnaList(@RequestParam("midx") int midx,
                                                @RequestParam("page") int page,
                                                @RequestParam(value="key", defaultValue = "") String key){
        System.out.println("🔥 getMyQnaList 호출됨 / midx=" + midx);
        return as.getMyQnaList(midx, page, key);
    }

    @PostMapping("/qnaWrite")
    public HashMap<String, Object> qnaWrite(@RequestBody Qna qna) {
        HashMap<String, Object> result = new HashMap<>();
        as.writeQna(qna);
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/confirmPass")
    public HashMap<String, Object> confirmPass(
            @RequestParam("qidx") int qidx, @RequestParam("pass") String pass) {
        HashMap<String, Object> result = new HashMap<>();
        Qna qna = as.getQna(qidx);
        if( qna.getPass().equals(pass) )    result.put("msg", "ok");
        else   result.put("msg", "fail");
        return result;
    }

    @GetMapping("/getQna")
    public HashMap<String, Object> getQna(@RequestParam("qidx") int qidx) {
        HashMap<String, Object> result = new HashMap<>();
        Qna qna = as.getQna(qidx);
        result.put("qna", qna);
        return result;
    }

    @GetMapping("/getMemberList")
    public HashMap<String, Object> getMemberList(@RequestParam("page") int page,
                                                 @RequestParam(value="key", required = false, defaultValue = "") String key){
        HashMap<String, Object> result = as.getMemberList(page, key);
        return result;
    }


    @GetMapping("/getReports")
    public HashMap<String, Object> getReports(@RequestParam("page") int page, @RequestParam(value="key", required=false, defaultValue="") String key, @RequestParam("tab") String tab) {
        HashMap<String, Object> result = as.getReports(page, key, tab);
        return result;
    }

    @PostMapping("/cancelReport")
    public HashMap<String, Object> cancelReport(@RequestParam("tab") String tab, @RequestParam("idx") int idx) {
        HashMap<String, Object> result = new HashMap<>();
        as.cancelReport(tab,idx);
        result.put("msg", "ok");
        return result;
    }

}
