package com.ott.server.repository;

import com.ott.server.entity.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListEntityRepository extends JpaRepository<ListEntity, Integer> {
    List<ListEntity> findByMidx(int midx);

    ListEntity findByListidx(int listidx);

    List<ListEntity> findAllByMidx(int midx);

    ListEntity findByMidxAndListidx(int midx, int listidx);
}
