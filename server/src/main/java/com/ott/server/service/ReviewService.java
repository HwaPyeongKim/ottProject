package com.ott.server.service;

import com.ott.server.dto.Paging;
import com.ott.server.entity.Review;
import com.ott.server.entity.ReviewReport;
import com.ott.server.repository.MemberRepository;
import com.ott.server.repository.ReviewReportRepository;
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
    private final ReviewReportRepository rrr;

    public void saveReview(Review review) {
        review.setDeleteyn("N");
        rr.save(review);
    }

    public HashMap<String,Object> getReviews(int dbidx, int season, String deleteyn, int page, int displayRow) {
        HashMap<String,Object> result = new HashMap<>();

        Paging paging = new Paging();
        paging.setDisplayRow(displayRow);
        paging.setPage(page);

        int count = rr.countByDbidxAndSeasonAndDeleteynAndContentIsNotNullAndContentNot(dbidx, season, deleteyn, "");
        paging.setTotalCount(count);
        paging.calPaging();

        Pageable pageable = PageRequest.of(page - 1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "writedate"));
        Page<Review> list = rr.findAllByDbidxAndSeasonAndDeleteynAndContentIsNotNullAndContentNot(dbidx, season, deleteyn, "", pageable);

        result.put("list", list.getContent());
        result.put("paging", paging);
        result.put("totalCount", count);
        return result;
    }

    public double getAverage(int dbidx, int season) {
        return rr.findAverageScoreByDbidxAndSeasonAndDeleteyn(dbidx, season, "N");
    }

    public void delete(int ridx) {
        Review review = rr.findByRidx(ridx);
        if (review != null) {
            review.setDeleteyn("Y");
        }
    }

    public void edit(Review review) {
        Review review1 = rr.findByRidx(review.getRidx());
        if (review1 != null) {
            review1.setScore(review.getScore());
            review1.setContent(review.getContent());
        }
    }

    public int spoil(int ridx, int midx) {
        ReviewReport reviewReport = rrr.findByRidxAndMidx(ridx, midx);
        if (reviewReport != null) {
            return 0;
        } else {
            ReviewReport report = new ReviewReport();
            report.setRidx(ridx);
            report.setMidx(midx);
            rrr.save(report);

            int count = rrr.countByRidx(ridx);
            if (count >= 5) {
                Review review = rr.findByRidx(ridx);
                review.setIsspoil("Y");
            }

            return 1;
        }
    }
}
