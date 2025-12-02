package com.ott.server.security.service;

import com.ott.server.dto.MemberDTO;
import com.ott.server.entity.Member;
import com.ott.server.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final MemberRepository mr;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("-----------------loadUserByUsername-----------------  username : " + username );

        // 이메일로 멤버를 조회
        Member member = mr.findByEmail( username );

        if( member == null )
            throw new UsernameNotFoundException( username  + " - User Not found" );

        List<String> list = new ArrayList<>();
        list.add("USER");

        MemberDTO memberdto = new MemberDTO(
                member.getEmail(),
                member.getPwd(),
                member.getMidx(),
                member.getName(),
                member.getNickname(),
                member.getPhone(),
                member.getZipnum(),
                member.getAddress1(),
                member.getAddress2(),
                member.getProvider(),
                member.getProfileimg(),
                member.getProfilemsg(),
                member.getRole(),
                member.getSnsid(),
                list
        );
        System.out.println(memberdto);
        System.out.println(member);
        return memberdto;  // security 시스템 내의 이메일과 패스워드를 비교하고 로그인 처리를 할 곳으로 리턴됩니다
    }
}
