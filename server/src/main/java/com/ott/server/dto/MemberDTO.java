package com.ott.server.dto;

import jakarta.persistence.Column;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MemberDTO extends User {

    public MemberDTO(
            String username, String password, int midx, String name, String nickname, String phone, String zipnum,
            String address1, String address2, String profileimg, String profilemsg, String snsid, List<String> authorities) {
        super(username, password,
            authorities.stream().map( str -> new SimpleGrantedAuthority("ROLE_"+str) ).collect(Collectors.toList())
        );
        this.midx = midx;
        this.name = name;
        this.nickname = nickname;
        this.email = username;
        this.pwd = password;
        this.phone = phone;
        this.zipnum = zipnum;
        this.address1 = address1;
        this.address2 = address2;
        this.profileimg = profileimg;
        this.profilemsg = profilemsg;
        this.snsid = snsid;
    }

    private int midx;
    private String name;
    private String nickname;
    private String email;
    private String pwd;
    private String phone;
    private String zipnum;
    private String address1;
    private String address2;
    private String profileimg;
    private String profilemsg;
    private String snsid;

    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("midx", midx);
        dataMap.put("name", name);
        dataMap.put("nickname", nickname);
        dataMap.put("email", email);
        dataMap.put("pwd", pwd);
        dataMap.put("phone", phone);
        dataMap.put("zipnum", zipnum);
        dataMap.put("address1", address1);
        dataMap.put("address2", address2);
        dataMap.put("profileimg", profileimg);
        dataMap.put("profilemsg", profilemsg);
        dataMap.put("snsid", snsid);
        return dataMap;
    }

}

