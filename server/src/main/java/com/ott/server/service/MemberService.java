package com.ott.server.service;


import com.ott.server.dto.Paging;
import com.ott.server.entity.Follow;
import com.ott.server.entity.ListEntity;
import com.ott.server.entity.Member;
import com.ott.server.repository.FollowRepository;
import com.ott.server.repository.ListEntityRepository;
import com.ott.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
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

    public HashMap<String, Object> getFollowings(int page, int midx) {
        //return fr.findByFromMember_Midx(midx);
        HashMap<String , Object> result = new HashMap<>();
        if( (Integer)page == null || page < 1 ){
            result.put("followings", fr.findAllByFromMember_Midx(midx));
        }else{
            Paging paging = new Paging();
            paging.setPage(page);

            //int count = fr.findAll().size();
            int count = fr.countByFromMember_Midx(midx);
            System.out.println("팔로우 카운트 : " + count);
            paging.setDisplayRow(7);
            paging.setDisplayPage(7);
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page - 1, paging.getDisplayRow() , Sort.by(Sort.Direction.DESC, "id"));
            Page<Follow> follows = fr.findByFromMember_Midx(midx, pageable);
            result.put("followings", follows.getContent());
            result.put("paging",  paging);
            result.put("totalFollowingsCount", count);
        }
        return result;
    }

    public HashMap<String, Object> getFollowers(int page, int midx) {
        //return fr.findByToMember_Midx(midx);
        HashMap<String , Object> result = new HashMap<>();
        if( (Integer)page == null || page < 1 ){
            result.put("followers", fr.findAllByToMember_Midx(midx));
        }else {
            Paging paging = new Paging();
            paging.setPage(page);

            //int count = fr.findAll().size();
            int count = fr.countByToMember_Midx(midx);
            System.out.println("팔로워 카운트 : " + count);
            paging.setDisplayRow(7);
            paging.setDisplayPage(7);
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page - 1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "id"));
            Page<Follow> follows = fr.findByToMember_Midx(midx, pageable);
            result.put("followers", follows.getContent());
            result.put("paging", paging);
            result.put("totalFollowersCount", count);
        }
        return result;
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
