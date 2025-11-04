package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class File {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int fidx;
    @Column(nullable = false, length = 200)
    private String originalname;
    @Column(nullable = false, length = 500)
    private String path;
    private int size;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private Timestamp writedate;

}
