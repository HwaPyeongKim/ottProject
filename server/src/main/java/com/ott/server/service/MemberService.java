package com.ott.server.service;


import com.ott.server.entity.Follow;
import com.ott.server.entity.ListEntity;
import com.ott.server.entity.Member;
import com.ott.server.repository.FollowRepository;
import com.ott.server.repository.ListEntityRepository;
import com.ott.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository mr;
    private final ListEntityRepository ler;
    private final FollowRepository fr;

    public Member checkEmail(String email) {
        return mr.findByEmail(email);
    }

    public Member checkNickname(String nickname) {
        return mr.findByNickname(nickname);
    }

    public void insertMember(Member member) {
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        member.setPwd(pe.encode(member.getPwd()));
        mr.save(member);
    }

    public Member getMember(String id) {
        return mr.findBySnsid(id);
    }

    public void updateMember(Member member) {
        Optional<Member> updateMember = mr.findByMidx(member.getMidx());
        Member mem = updateMember.get();
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        mem.setPwd(pe.encode(member.getPwd()));
        mem.setEmail(member.getEmail());
        mem.setNickname(member.getNickname());
        mem.setPhone(member.getPhone());
        mem.setZipnum(member.getZipnum());
        mem.setAddress1(member.getAddress1());
        mem.setAddress2(member.getAddress2());
        mem.setProfileimg(member.getProfileimg());
        mem.setProfilemsg(member.getProfilemsg());
    }

    public List<ListEntity> getList(int midx) {
        return ler.findByMidx(midx);
    }

    public List<Follow> getFollowings(int midx) {
        return fr.findByFromMember_Midx(midx);
    }

    public List<Follow> getFollowers(int midx) {
        return fr.findByToMember_Midx(midx);
    }

    public Optional<Member> getFollowMember(int midx) {
        Optional<Member> member = mr.findByMidx(midx);
        return member;
    }

    public void insertFollow(Follow follow) {
        fr.save(follow);
    }

    public void deleteFollow(Follow follow) {
        fr.deleteByFfromAndFto(follow.getFfrom(), follow.getFto());
    }
}
