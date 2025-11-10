package com.ott.server.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Follow {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    private int ffrom;
    private int fto;

    @ManyToOne
    @JoinColumn(name = "ffrom", insertable = false, updatable = false)
    private Member fromMember;

    @ManyToOne
    @JoinColumn(name = "fto", insertable = false, updatable = false)
    private Member toMember;

}
