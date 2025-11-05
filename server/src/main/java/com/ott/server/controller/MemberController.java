package com.ott.server.controller;

import com.ott.server.entity.FileEntity;
import com.ott.server.entity.Member;
import com.ott.server.service.MemberService;
import com.ott.server.service.S3UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    MemberService ms;

    @Autowired
    S3UploadService sus;

    @PostMapping("/upload")
    public HashMap<String, Object> fileUpload(  @RequestParam("image") MultipartFile file ) {
        HashMap<String , Object> result = new HashMap<>();
        System.out.println("111111111111111");
        try{
            int fidx = sus.saveFile(file);
            FileEntity fileEntity = sus.getFile(fidx);

            result.put("fidx", fileEntity.getFidx());
            result.put("image", sus.getFileUrl(fileEntity.getPath()));
            result.put("filename", fileEntity.getOriginalname());
        }catch (IllegalStateException | IOException e){
            e.printStackTrace();
        }
        System.out.println("이미지 업로드 서버: " + result);
        return result;
    }

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
        member.setDeleteyn("N");
        member.setProvider("LOCAL"); // LOCAL: 일반 , KAKAO: 카카오
        member.setRole(1); // 1: 일반 , 2: 관리자
        ms.insertMember(member);
        result.put("msg", "ok");
        return result;
    }

}
