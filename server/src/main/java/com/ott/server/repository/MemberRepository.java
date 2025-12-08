package com.ott.server.repository;

import com.ott.server.entity.Board;
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

    long countByNameContainingOrNicknameContainingOrEmailContainingOrAddress1Containing(
            String name, String nickname, String email, String address1
    );

    // 검색 + 페이징용
    Page<Member> findByNameContainingOrNicknameContainingOrEmailContainingOrAddress1Containing(
            String name, String nickname, String email, String address1,
            Pageable pageable
    );

    Optional<Member> findByMidxAndDeleteynNot(int midx, String y);
}
