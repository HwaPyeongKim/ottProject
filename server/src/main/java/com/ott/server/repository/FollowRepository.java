package com.ott.server.repository;

import com.ott.server.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Integer> {
    List<Follow> findByFfrom(int ffrom);

    List<Follow> findByFto(int fto);

    List<Follow> findByFromMember_Midx(int midx);

    List<Follow> findByToMember_Midx(int midx);
}
