package com.ott.server.controller;

import com.ott.server.entity.Review;
import com.ott.server.service.ReviewService;
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

    @GetMapping("/getReviews")
    public HashMap<String,Object> getReviews(@RequestParam("dbidx") int dbidx, @RequestParam(value="deleteyn", required = false, defaultValue="N") String deleteyn) {
        HashMap<String,Object> result = new HashMap<>();
        result.put("list", rs.getReviews(dbidx,deleteyn));
        result.put("msg", "ok");
        return result;
    }

}