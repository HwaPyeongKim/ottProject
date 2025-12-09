package com.ott.server.repository;

import com.ott.server.entity.DbList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DbListRepository extends JpaRepository<DbList, Integer> {

    List<DbList> findAllByListidx(int listidx, Sort id);

    int countByListidx(int listidx);

    Page<DbList> findByListidx(int listidx, Pageable pageable);

    boolean existsByListidxAndDbidx(int listidx, int dbidx);

    void deleteByListidxAndDbidx(int listidx, int dbidx);
    DbList findByListidxAndDbidx(int listidx, int dbidx);

    @Query("SELECT d.dbidx, d.posterpath, d.title, d.type, COUNT(d.dbidx) AS cnt " +
            "FROM DbList d " +
            "GROUP BY d.dbidx, d.posterpath, d.title, d.type " +
            "ORDER BY cnt DESC")
    List<Object[]> findMostAddedTitles();
}
