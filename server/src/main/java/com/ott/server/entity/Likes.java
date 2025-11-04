package com.ott.server.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Likes {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int lidx;
    private int dbidx;
    private int midx;

}
