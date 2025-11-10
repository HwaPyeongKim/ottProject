package com.ott.server.controller;

import com.ott.server.entity.FileEntity;
import com.ott.server.service.S3UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/file")
public class FileController{

    @Autowired
    S3UploadService sus;

    @GetMapping("/url/{fidx}")
    public HashMap<String, Object> getFile(@PathVariable("fidx") int fidx){
        FileEntity fileentity = sus.getFile(fidx);

        HashMap<String, Object> result = new HashMap<>();
        result.put("fidx", fileentity.getFidx());
        result.put("image", sus.getFileUrl(fileentity.getPath()));
        result.put("filename", fileentity.getOriginalname());

        return result;
    }

    @GetMapping("/imgUrl/{fidx}")
    public HashMap<String, Object> getFollowImg(@PathVariable("fidx") int fidx){
        FileEntity fileentity = sus.getFile(fidx);

        HashMap<String, Object> result = new HashMap<>();
        result.put("fidx", fileentity.getFidx());
        result.put("image", sus.getFileUrl(fileentity.getPath()));
        result.put("filename", fileentity.getOriginalname());

        return result;
    }
}
