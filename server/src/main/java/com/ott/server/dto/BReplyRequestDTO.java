package com.ott.server.dto;

import lombok.Data;

@Data
public class BReplyRequestDTO {
    private Integer boardId;
    private Integer memberId;
    private String content;
    private Integer pcidx;
}
