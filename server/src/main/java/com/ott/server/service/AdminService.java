package com.ott.server.service;

import com.ott.server.dto.Paging;
import com.ott.server.entity.Qna;
import com.ott.server.repository.MemberRepository;
import com.ott.server.repository.QnaRepository;
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

}
