package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int qidx;
    private int midx;
    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false, length = 2000)
    private String content;
    @Column(length = 500)
    private String reply;
    @Column( columnDefinition="DATETIME default now()" )
    @CreationTimestamp
    private String writedate;
    @Column(length = 100)
    private String pass;
    @Column( length = 5)  @ColumnDefault("'N'")
    private String security;

    @ManyToOne
    @JoinColumn(name = "midx", insertable = false, updatable = false)
    private Member member;

}
