package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
@Table(name = "list")
public class ListEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int listidx;
    private int midx;
    private String title;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp indate;
    @ColumnDefault("'N'")
    private String security;

}
