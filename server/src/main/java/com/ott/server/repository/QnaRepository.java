package com.ott.server.repository;

import com.ott.server.entity.Qna;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface QnaRepository extends JpaRepository<Qna, Integer> {
    Collection<Qna> findByTitleContaining(String key);
    Page<Qna> findAllByTitleContaining(String key, Pageable pageable);

    Qna findByQidx(int qidx);

    List<Qna> findByMember_Midx(int midx);
    Page<Qna> findAllByMember_Midx(int midx, Pageable pageable);

    List<Qna> findByMember_MidxAndTitleContaining(int midx, String key);
    Page<Qna> findAllByMember_MidxAndTitleContaining(int midx, String key, Pageable pageable);


}
