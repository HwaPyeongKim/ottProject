package com.ott.server.service;

import com.ott.server.entity.Review;
import com.ott.server.repository.MemberRepository;
import com.ott.server.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository rr;
    private final MemberRepository mr;

    public void saveReview(Review review) {
        review.setDeleteyn("N");
        rr.save(review);
    }

    public List<Review> getReviews(int dbidx, String deleteyn) {
        List<Review> list = rr.findAllByDbidxAndDeleteynOrderByWritedateDesc(dbidx, deleteyn);
        return list;
    }
}
