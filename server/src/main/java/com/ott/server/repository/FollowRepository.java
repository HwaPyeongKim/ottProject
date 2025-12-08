package com.ott.server.repository;

import com.ott.server.entity.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Integer> {

    Page<Follow> findByFromMember_Midx(int midx, Pageable pageable);

    Page<Follow> findByToMember_Midx(int midx, Pageable pageable);

    void deleteByFfromAndFto(int ffrom, int fto);

    List<Follow> findAllByFromMember_Midx(int midx);

    List<Follow> findAllByToMember_Midx(int midx);

    int countByFromMember_Midx(int midx);

    int countByToMember_Midx(int midx);

    List<Follow> findAllByFfromAndToMember_Deleteyn(int midx, String n);

    int countByFfromAndToMember_Deleteyn(int midx, String n);

    Page<Follow> findByFfromAndToMember_Deleteyn(int midx, String n, Pageable pageable);

    List<Follow> findAllByFtoAndFromMember_Deleteyn(int midx, String n);

    int countByFtoAndFromMember_Deleteyn(int midx, String n);

    Page<Follow> findByFtoAndFromMember_Deleteyn(int midx, String n, Pageable pageable);
}
