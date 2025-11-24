package com.ott.server.dto;

import lombok.Data;

@Data
public class BCommentRequestDTO {
    private Integer boardId;
    private Integer memberId;
    private String content;
}
