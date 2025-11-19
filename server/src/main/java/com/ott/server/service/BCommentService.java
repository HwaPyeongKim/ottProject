package com.ott.server.service;

import com.ott.server.entity.BComment;
import com.ott.server.entity.Board;
import com.ott.server.entity.Member;
import com.ott.server.repository.BCommentRepository;
import com.ott.server.repository.BoardRepository;
import com.ott.server.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BCommentService {

    private final MemberRepository mr;
    private final BoardRepository br;
    private final BCommentRepository cr;

    public List<BComment> getCommentList(int bidx) {
        return cr.findByBoardBidxAndDeleteynOrderByBcidxDesc(bidx, "N");
    }

    public void addComment(BComment bcomment) {
        // Board 조회
        Board board = br.findById(bcomment.getBoard().getBidx())
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        // Member 조회
        Member member = mr.findById(bcomment.getMember().getMidx())
                .orElseThrow(() -> new RuntimeException("회원 없음"));

        // 댓글 세팅
        BComment comment = new BComment();
        comment.setBoard(board);
        comment.setMember(member);
        comment.setContent(bcomment.getContent());
        comment.setPcidx(bcomment.getPcidx());

        // 저장
        cr.save(comment);
    }
}
