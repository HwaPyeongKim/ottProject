package com.ott.server.repository;

import com.ott.server.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    Member findByEmail(String email);

    Member findByNickname(String nickname);
}
