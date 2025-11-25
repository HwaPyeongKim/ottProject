package com.ott.server.dto;

import com.ott.server.entity.Board;
import com.ott.server.entity.Member;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class BCommentResponseDTO {
    private Integer bcidx;
    private String content;
    private Timestamp writedate;
    private String memberNickname;
    private String memberProfileUrl;
    private Integer pcidx;
}
