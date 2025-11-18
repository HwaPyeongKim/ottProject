package com.ott.server.service;

import com.ott.server.entity.Likes;
import com.ott.server.repository.LikesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MainService {

    private final LikesRepository lr;

    public HashMap<String, Object> getLikes(int midx, int dbidx, int season) {
        HashMap<String, Object> result = new HashMap<>();
        int count = lr.countByDbidxAndSeason(dbidx, season);
        Likes likes = lr.findByMidxAndDbidxAndSeason(midx, dbidx, season);
        result.put("count", count);
        result.put("likes", likes);
        return result;
    }

    public HashMap<String, Object> like(Likes likes) {
        HashMap<String, Object> result = new HashMap<>();
        Likes likesData = lr.findByMidxAndDbidxAndSeason(likes.getMidx(), likes.getDbidx(), likes.getSeason());
        if (likesData != null) {
            lr.delete(likesData);
        } else {
            likesData = new Likes();
            likesData.setMidx(likes.getMidx());
            likesData.setDbidx(likes.getDbidx());
            likesData.setSeason(likes.getSeason());
            lr.save(likesData);
        }
        return result;
    }

    public List<Likes> getMyLikes(int midx) {
        List<Likes> result = lr.findAllByMidx(midx);
        return result;
    }
}
