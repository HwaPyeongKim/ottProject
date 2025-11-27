package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class Board {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int bidx;
    private int midx;
    private String title;
    @Column(length = 2000)
    private String content;
    @ColumnDefault("0")
    private int pass = 0;
    @ColumnDefault("0")
    private int likecount = 0;
//    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp writedate;
    @ColumnDefault("0")
    private int fidx = 0;
    @ColumnDefault("0")
    private int reportcount = 0;
    @Enumerated(EnumType.STRING)
    private BoardStatus status = BoardStatus.NORMAL;

    @ManyToOne
    @JoinColumn(name = "midx", insertable = false, updatable = false)
    private Member boardMember;
}
