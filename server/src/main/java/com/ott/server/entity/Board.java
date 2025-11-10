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
    private int pass;
    private int readcount;
    private int likecount;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp writedate;
    private int fidx;
    @ColumnDefault("'N'")
    private String deleteyn;

    @ManyToOne
    @JoinColumn(name = "midx", insertable = false, updatable = false)
    private Member boardMember;

}
