package com.ott.server.dto;

import com.ott.server.entity.BComment;
import com.ott.server.entity.Board;
import com.ott.server.entity.Member;

public class BCommentMapper {

    public static BCommentResponseDTO  toResponseDTO(BComment entity) {
        BCommentResponseDTO dto = new BCommentResponseDTO();
        dto.setBcidx(entity.getBcidx());
        dto.setContent(entity.getContent());
        dto.setWritedate(entity.getWritedate());
        dto.setMemberNickname(entity.getMember().getNickname());
        dto.setMemberProfileUrl(entity.getMember().getProfileimg());
        dto.setPcidx(entity.getPcidx());
        return dto;
    }

    public static BComment toEntity(BCommentRequestDTO dto, Board board, Member member) {
        BComment entity = new BComment();
        entity.setBoard(board);
        entity.setMember(member);
        entity.setContent(dto.getContent());
        return entity;
    }

    public static BComment toEntity(BReplyRequestDTO dto, Board board, Member member) {
        BComment entity = new BComment();
        entity.setBoard(board);
        entity.setMember(member);
        entity.setContent(dto.getContent());
        entity.setPcidx(dto.getPcidx());
        return entity;
    }
}
