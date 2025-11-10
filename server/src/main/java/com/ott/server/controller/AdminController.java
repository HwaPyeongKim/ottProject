package com.ott.server.controller;

import com.ott.server.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
