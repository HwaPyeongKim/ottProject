package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int midx;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String nickname;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String pwd;
    @Column(nullable = false)
    private String phone;
    private String zipnum;
    private String address1;
    private String address2;
    @ColumnDefault("'LOCAL'")
    private String provider;
    private String profileimg;
    private String profilemsg;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp indate;
    @ColumnDefault("'N'")
    private String deleteyn;
    @ColumnDefault("'1'")
    private int role;

}
