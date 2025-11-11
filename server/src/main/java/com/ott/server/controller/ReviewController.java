package com.ott.server.controller;

import com.ott.server.entity.Review;
import com.ott.server.service.ReviewService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    ReviewService rs;

    @PostMapping("/saveReview")
    public HashMap<String,Object> saveReview(@RequestBody Review review) {
        HashMap<String,Object> result = new HashMap<>();
        rs.saveReview(review);
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getReviews/{page}")
    public HashMap<String,Object> getReviews(@RequestParam("dbidx") int dbidx, @RequestParam(value="deleteyn", required = false, defaultValue="N") String deleteyn, @RequestParam(value="displayRow", required = false, defaultValue="5") int displayRow, @PathVariable("page") int page) {
        HashMap<String,Object> result = new HashMap<>();
        HashMap<String,Object> reviews = rs.getReviews(dbidx, deleteyn, page, displayRow);
        result.put("list", reviews.get("list"));
        result.put("paging", reviews.get("paging"));
        result.put("totalCount", reviews.get("totalCount"));
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getAverage")
    public HashMap<String,Object> getAverage(@RequestParam("dbidx") int dbidx) {
        HashMap<String,Object> result = new HashMap<>();
        result.put("average", rs.getAverage(dbidx));
        return result;
    }

    @DeleteMapping("/delete/{ridx}")
    public HashMap<String,Object> delete(@PathVariable("ridx") int ridx) {
        HashMap<String,Object> result = new HashMap<>();
        rs.delete(ridx);
        result.put("msg", "ok");
        return result;
    }

}