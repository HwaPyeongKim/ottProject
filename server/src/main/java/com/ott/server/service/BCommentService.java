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
        return cr.findByBoard_BidxAndDeleteynOrderByBcidxDesc(bidx, "N");
    }
//    public List<BComment> getCommentList(int bidx) {
//        List<BComment> list = cr.findByBoard_BidxAndDeleteynOrderByBcidxDesc(bidx, "N");
//        System.out.println("댓글 조회된 개수 = " + list.size());
//        for (BComment c : list) {
//            System.out.println("bcidx=" + c.getBcidx() + ", bidx=" + c.getBoard().getBidx());
//        }
//        return list;
//    }
    public void addComment(BComment bcomment) {
        Board board = br.findById(bcomment.getBoard().getBidx())
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        Member member = mr.findById(bcomment.getMember().getMidx())
                .orElseThrow(() -> new RuntimeException("회원 없음"));

        bcomment.setBoard(board);
        bcomment.setMember(member);
        cr.save(bcomment);
    }
}
