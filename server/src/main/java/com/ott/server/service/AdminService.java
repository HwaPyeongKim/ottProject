package com.ott.server.service;

import com.ott.server.dto.Paging;
import com.ott.server.entity.*;
import com.ott.server.repository.BoardRepository;
import com.ott.server.repository.MemberRepository;
import com.ott.server.repository.QnaRepository;
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
public class AdminService {

    private final MemberRepository mr;
    private final QnaRepository qr;
    private final BoardRepository br;
    private final ReviewRepository rr;


    public HashMap<String, Object> getQnaList(int page, String key) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);
        if( key.equals("") ) {
            int count = qr.findAll().size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "qidx"));
            Page<Qna> list = qr.findAll( pageable );
            result.put("qnaList", list.getContent());
        }else{
            int count = qr.findByTitleContaining(key).size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 10, Sort.by(Sort.Direction.DESC, "qidx"));
            Page<Qna> list = qr.findAllByTitleContaining( key, pageable );
            result.put("qnaList", list.getContent());
        }
        result.put("paging", paging);
        result.put("key", key);
        return result;
    }

    public void writeQna(Qna qna) {
        qr.save(qna);
    }

    public Qna getQna(int qidx) {
        return qr.findByQidx(qidx);
    }

    public HashMap<String, Object> getMyQnaList(int midx, int page, String key) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);

        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Direction.DESC, "qidx"));

        if (key.equals("")) {
            // 🔹 내가 작성한 모든 QnA 개수
            int count = qr.findByMember_Midx(midx).size();
            paging.setTotalCount(count);
            paging.calPaging();

            // 🔹 내가 작성한 QnA 목록
            Page<Qna> list = qr.findAllByMember_Midx(midx, pageable);
            result.put("qnaList", list.getContent());

        } else {
            // 🔹 내가 작성한 QnA 중 검색 결과 개수
            int count = qr.findByMember_MidxAndTitleContaining(midx, key).size();
            paging.setTotalCount(count);
            paging.calPaging();

            // 🔹 내가 작성한 QnA + 검색 키워드 적용
            Page<Qna> list = qr.findAllByMember_MidxAndTitleContaining(midx, key, pageable);
            result.put("qnaList", list.getContent());
        }

        result.put("paging", paging);
        result.put("key", key);
        return result;
    }

    public HashMap<String, Object> getMemberList(int page, String key, String sortField, String sortDir) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);

        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortField).ascending()
                : Sort.by(sortField).descending();

        Pageable pageable = PageRequest.of(page - 1, 10, sort);
        Page<Member> list;

        if (key == null || key.equals("")) {
            long count = mr.count();
            paging.setTotalCount((int) count);
            paging.calPaging();
            list = mr.findAll(pageable);
        } else {
            long count = mr.countByNameContainingOrNicknameContainingOrEmailContainingOrAddress1Containing(
                    key, key, key, key
            );
            paging.setTotalCount((int) count);
            paging.calPaging();

            list = mr.findByNameContainingOrNicknameContainingOrEmailContainingOrAddress1Containing(
                    key, key, key, key,
                    pageable
            );
        }

        result.put("memberList", list.getContent());
        result.put("paging", paging);
        result.put("sortField", sortField);
        result.put("sortDir", sortDir);
        return result;
    }

    public HashMap<String, Object> getReports(int page, String key, String tab, String sort, String dir) {
        HashMap<String, Object> result = new HashMap<>();
        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(10);
        paging.setDisplayRow(10);

        Sort.Direction direction = dir.equalsIgnoreCase("asc") ? Sort.Direction.DESC : Sort.Direction.ASC;

        String sortFieldConverted;
        if (tab.equals("community")) {
            switch (sort) {
                case "nickname":
                    sortFieldConverted = "boardMember.nickname";
                    break;
                default:
                    sortFieldConverted = sort;
            }
        } else {
            switch (sort) {
                case "nickname":
                    sortFieldConverted = "member.nickname";
                    break;
                default:
                    sortFieldConverted = sort;
            }
        }

        if (tab.equals("community")) {
            if (key.equals("")) {
                int count = br.countByStatus(BoardStatus.BLURRED);
                paging.setTotalCount(count);
                paging.calPaging();
                int pageNumber = (page < 1) ? 0 : page - 1;
                Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by(direction, sortFieldConverted));
                Page<Board> list = br.findByStatus(BoardStatus.BLURRED, pageable );
                result.put("list", list.getContent());
            } else {
                int count = br.countByKeyAndStatus(key);
                paging.setTotalCount(count);
                paging.calPaging();
                int pageNumber = (page < 1) ? 0 : page - 1;
                Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by(direction, sortFieldConverted));
                Page<Board> list = br.searchByKeyAndStatus(BoardStatus.BLURRED , key, pageable);
                result.put("list", list.getContent());
            }
        } else {
            if (key.equals("")) {
                int count = rr.countByIsspoil("Y");
                paging.setTotalCount(count);
                paging.calPaging();
                int pageNumber = (page < 1) ? 0 : page - 1;
                Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by(direction, sortFieldConverted));
                Page<Review> list = rr.findByIsspoil( "Y" , pageable );
                result.put("list", list.getContent());
            } else {
                int count = rr.countByKeyAndIsspoil(key);
                paging.setTotalCount(count);
                paging.calPaging();
                int pageNumber = (page < 1) ? 0 : page - 1;
                Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by(direction, sortFieldConverted));
                Page<Review> list = rr.searchByKeyAndIsspoil(key, pageable);
                result.put("list", list.getContent());
            }
        }

        result.put("paging", paging);
        return result;
    }

    public HashMap<String, Object> cancelReport(String tab, int idx) {
        HashMap<String, Object> result = new HashMap<>();
        if (tab.equals("community")) {
            Board board = br.findByBidx(idx);
            if (board != null) {
                board.setStatus(BoardStatus.NORMAL);
                result.put("msg", "ok");
            } else {
                result.put("msg", "게시글을 찾을 수 없습니다");
            }
        } else {
            Review review = rr.findByRidx(idx);
            if (review != null) {
                review.setIsspoil("N");
                result.put("msg", "ok");
            } else {
                result.put("msg", "후기를 찾을 수 없습니다");
            }
        }
        return result;
    }

    public void updateReply(int qidx, String reply) {
        Qna qna = qr.findByQidx( qidx );
        qna.setReply( reply );
    }
}
