package com.ott.server.repository;

import com.ott.server.entity.Qna;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface QnaRepository extends JpaRepository<Qna, Integer> {
    Collection<Qna> findByTitleContaining(String key);
    Page<Qna> findAllByTitleContaining(String key, Pageable pageable);

    Qna findByQidx(int qidx);
}
