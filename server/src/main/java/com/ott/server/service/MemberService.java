package com.ott.server.service;


import com.ott.server.entity.Member;
import com.ott.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository mr;

    public Member checkEmail(String email) {
        return mr.findByEmail(email);
    }

    public Member checkNickname(String nickname) {
        return mr.findByNickname(nickname);
    }

    public void insertMember(Member member) {
        mr.save(member);
    }
}
