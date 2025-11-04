package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class Comment {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int cidx;
    private int dbidx;
    private int midx;
    @Column(length = 500)
    private String content;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp writedate;
    private int pcidx;
    @ColumnDefault("'N'")
    private String deleteyn;

}
