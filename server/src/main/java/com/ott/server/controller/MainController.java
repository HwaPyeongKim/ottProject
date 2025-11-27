package com.ott.server.controller;

import com.ott.server.entity.Likes;
import com.ott.server.entity.ListEntity;
import com.ott.server.service.MainService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/main")
public class MainController {

    @Autowired
    MainService ms;

    @GetMapping("/getLikes")
    public HashMap<String, Object> getLikes(@RequestParam("dbidx") int dbidx, @RequestParam(value="midx", required = false, defaultValue = "0") int midx, @RequestParam(value="season", required = false, defaultValue = "0") int season) {
        HashMap<String, Object> result = new HashMap<>();
        HashMap<String, Object> likes = ms.getLikes(midx, dbidx, season);
        result.put("count", likes.get("count"));
        result.put("likes", likes.get("likes"));
        return result;
    }

    @PostMapping("/like")
    public HashMap<String, Object> like(@RequestBody Likes likes){
        HashMap<String,Object> result = new HashMap<>();
        HashMap<String,Object> like = ms.like(likes);
        return result;
    }

    @GetMapping("/getMyLikes")
    public HashMap<String, Object> getMyLikes(@RequestParam("midx") int midx) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("list", ms.getMyLikes(midx));
        return result;
    }

    @Data
    public static class AddRequest {
        private List<Integer> listidxs;
        private int dbidx;
        private String title;
        private String posterpath;
        private String type;
    }

    @PostMapping("/addLists")
    public HashMap<String, Object> addLists(@RequestBody AddRequest request) {
        HashMap<String, Object> result = new HashMap<>();
        for (int listidx : request.getListidxs()) {
            ms.addLists(listidx, request.getDbidx(), request.getPosterpath(), request.getTitle(), request.getType());
        }
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getMyDblists")
    public HashMap<String, Object> getMyDblists(@RequestParam("midx") int midx) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("list", ms.getMyDblists(midx));
        return result;
    }

    @PostMapping("/addList")
    public HashMap<String, Object> addList(@RequestBody ListEntity list) {
        HashMap<String, Object> result = new HashMap<>();
        ms.addList(list);
        result.put("msg", "ok");
        return result;
    }

}
