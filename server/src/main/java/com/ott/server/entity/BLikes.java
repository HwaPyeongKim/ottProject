package com.ott.server.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class BLikes {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int blidx;
    private int bidx;
    private int midx;

}
