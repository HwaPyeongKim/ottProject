package com.ott.server.repository;

import com.ott.server.entity.Qna;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface QnaRepository extends JpaRepository<Qna, Integer> {
    Collection<Qna> findByTitleContainingOrContentContaining(String key, String key1);
    Page<Qna> findAllByTitleContainingOrContentContaining(String key, String key1, Pageable pageable);

    Qna findByQidx(int qidx);
}
