package com.ott.server.controller;

import com.ott.server.entity.Member;
import com.ott.server.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    MemberService ms;

    @PostMapping("/emailcheck")
    public HashMap<String, Object> emailcheck(@RequestParam String email){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.checkEmail(email);
        if(member == null){
            result.put("msg", "ok");
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    @PostMapping("/nicknamecheck")
    public HashMap<String, Object> nicknamecheck(@RequestParam String nickname){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.checkNickname(nickname);
        if(member == null){
            result.put("msg", "ok");
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    @PostMapping("/join")
    public HashMap<String, Object> join(@RequestBody Member member){
        HashMap<String, Object> result = new HashMap<>();
        ms.insertMember(member);
        result.put("msg", "ok");
        return result;
    }

}
