package com.ott.server.repository;

import com.ott.server.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    Member findByEmail(String email);

    Member findByNickname(String nickname);

    Member findBySnsid(String id);

    Optional<Member> findByMidx(int midx);

    Collection<Object> findByNameContaining(String key);

    Page<Member> findAllByNameContaining(String key, Pageable pageable);
}
