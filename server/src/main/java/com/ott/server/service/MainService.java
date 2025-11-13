package com.ott.server.service;

import com.ott.server.entity.Likes;
import com.ott.server.repository.LikesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;

@Service
@Transactional
@RequiredArgsConstructor
public class MainService {

    private final LikesRepository lr;

    public HashMap<String, Object> getLikes(int midx, int dbidx) {
        HashMap<String, Object> result = new HashMap<>();
        int count = lr.countByDbidx(dbidx);
        Likes likes = lr.findByMidxAndDbidx(midx, dbidx);
        result.put("count", count);
        result.put("likes", likes);
        return result;
    }

    public HashMap<String, Object> like(Likes likes) {
        HashMap<String, Object> result = new HashMap<>();
        Likes likesData = lr.findByMidxAndDbidx(likes.getMidx(), likes.getDbidx());
        if (likesData != null) {
            lr.delete(likesData);
        } else {
            likesData = new Likes();
            likesData.setMidx(likes.getMidx());
            likesData.setDbidx(likes.getDbidx());
            lr.save(likesData);
        }
        return result;
    }

}
