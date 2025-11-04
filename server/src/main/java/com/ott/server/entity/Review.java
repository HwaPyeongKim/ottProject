package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ridx;
    private int dbidx;
    private int midx;
    @Column(nullable = false)
    private int score;
    @Column(nullable = false, length = 2000)
    private String content;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp writedate;
    @ColumnDefault("'N'")
    private String deleteyn;

}
