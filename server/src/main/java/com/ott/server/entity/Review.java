package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

import java.sql.Timestamp;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ridx;
    private int dbidx;
    private int season;
    private int midx;
    @Column(nullable = false)
    private double score;
    @Column(nullable = false, length = 2000)
    private String content;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp writedate;
    @ColumnDefault("'N'")
    private String isspoil = "N";
    @ColumnDefault("'N'")
    private String deleteyn = "N";
    private String posterpath;
    private String title;
    private String type;

    @ManyToOne
    @JoinColumn(name = "midx", insertable = false, updatable = false)
    private Member member;

    @Formula("(SELECT COUNT(rr.report_idx) FROM review_report rr WHERE rr.ridx = ridx)")
    private int reportcount;
}
