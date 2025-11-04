package com.ott.server.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class BComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bcidx;
    private int bidx;
    private int midx;
    private String content;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp writedate;
    private int pcidx;
    @ColumnDefault("'N'")
    private String deleteyn;

    @ManyToOne
    @JoinColumn(name = "member_midx")
    Member member;

}
