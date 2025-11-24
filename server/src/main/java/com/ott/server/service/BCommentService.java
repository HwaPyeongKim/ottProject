package com.ott.server.service;

import com.ott.server.dto.BCommentMapper;
import com.ott.server.dto.BCommentRequestDTO;
import com.ott.server.dto.BCommentResponseDTO;
import com.ott.server.dto.BReplyRequestDTO;
import com.ott.server.entity.BComment;
import com.ott.server.entity.Board;
import com.ott.server.entity.Member;
import com.ott.server.repository.BCommentRepository;
import com.ott.server.repository.BoardRepository;
import com.ott.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BCommentService {

    private final MemberRepository mr;
    private final BoardRepository br;
    private final BCommentRepository cr;

    public List<BCommentResponseDTO> getCommentList(int bidx) {
        Board boardEntity = br.findById(bidx).orElseThrow(() -> new RuntimeException("게시글 없음"));;
        List<BComment> list = cr.findAllByBoardWithMember(boardEntity);
//        System.out.println("댓글 조회된 개수 = " + list.size());

        List<BCommentResponseDTO> result = new ArrayList<>();
        for (BComment c : list) {
//            System.out.println("bcidx=" + c.getBcidx() + ", bidx=" + c.getBoard().getBidx());
            BCommentResponseDTO resDto = BCommentMapper.toResponseDTO(c);
            result.add(resDto);
        }
        return result;
    }

    public void addComment(BCommentRequestDTO reqDto) {
        Board boardEntity = br.findById(reqDto.getBoardId()).orElseThrow(() -> new RuntimeException("게시글 없음"));
        Member memberEntity = mr.findById(reqDto.getMemberId()).orElseThrow(() -> new RuntimeException("멤버 없음"));

        BComment commentEntity = BCommentMapper.toEntity(reqDto, boardEntity, memberEntity);
        cr.save(commentEntity);
    }

    public void addReply(BReplyRequestDTO reqDto) {
        Board boardEntity = br.findById(reqDto.getBoardId()).orElseThrow(() -> new RuntimeException("게시글 없음"));
        Member memberEntity = mr.findById(reqDto.getMemberId()).orElseThrow(() -> new RuntimeException("멤버 없음"));

        BComment replyEntity = BCommentMapper.toEntity(reqDto, boardEntity, memberEntity);
        replyEntity.setPcidx(reqDto.getPcidx());
        cr.save(replyEntity);
    }

    public long getCommentCount(int bidx) {
        return cr.countByBoardId(bidx);
    }

    public void updateReply(int bcidx, String content) {
        BComment comment = cr.findById(bcidx).orElseThrow(() -> new RuntimeException("댓글 없음"));
        comment.setContent(content);
        cr.save(comment);
    }

    public void deleteReply(int bcidx) {
        BComment comment = cr.findById(bcidx).orElseThrow(() -> new RuntimeException("댓글 없음"));
        cr.delete(comment);
    }
}
