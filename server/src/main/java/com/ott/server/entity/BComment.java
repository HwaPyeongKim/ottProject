package com.ott.server.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(length = 1000, nullable = false)
    private String content;
//    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp writedate;
    private Integer pcidx;
    @ColumnDefault("'N'")
    private String deleteyn = "N";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidx")
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "midx")
    private Member member;
}
