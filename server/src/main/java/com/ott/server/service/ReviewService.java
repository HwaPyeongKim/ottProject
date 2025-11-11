package com.ott.server.service;

import com.ott.server.dto.Paging;
import com.ott.server.entity.Review;
import com.ott.server.repository.MemberRepository;
import com.ott.server.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;

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

    public HashMap<String,Object> getReviews(int dbidx, String deleteyn, int page, int displayRow) {
        HashMap<String,Object> result = new HashMap<>();

        Paging paging = new Paging();
        paging.setDisplayRow(displayRow);
        paging.setPage(page);

        int count = rr.countByDbidxAndDeleteyn(dbidx, deleteyn);
        paging.setTotalCount(count);
        paging.calPaging();

        Pageable pageable = PageRequest.of(page - 1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "writedate"));
        Page<Review> list = rr.findAllByDbidxAndDeleteyn(dbidx, deleteyn, pageable);

        result.put("list", list.getContent());
        result.put("paging", paging);
        result.put("totalCount", count);
        return result;
    }

    public double getAverage(int dbidx) {
        return rr.findAverageScoreByDbidxAndDeleteyn(dbidx, "N");
    }

    public void delete(int ridx) {
        Review review = rr.findByRidx(ridx);
        if (review != null) {
            review.setDeleteyn("Y");
        }
    }
}
