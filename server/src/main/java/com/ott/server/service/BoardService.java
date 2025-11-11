package com.ott.server.service;

import com.ott.server.entity.BLikes;
import com.ott.server.entity.Board;
import com.ott.server.repository.BLikesRepository;
import com.ott.server.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository br;
    private final BLikesRepository blr;

    public List<Board> getBoardList() {
        return br.findAllByOrderByWritedateDesc();
    }

    public Object insertBoard(Board board) {
        return br.save(board);
    }

    public List<BLikes> getLikeList(int boardid) {
        return blr.findByBidx(boardid);
    }

    public void addlike(BLikes blikes) {
        BLikes existing = blr.findByBidxAndMidx(blikes.getBidx(), blikes.getMidx());
        if (existing == null) {
            blr.save(blikes);
        }else {
//            Optional<BLikes> delLikes = blr.findByBlidx(list.getBlidx());
//            BLikes delList = delLikes.get();
//            blr.save(delList);
            blr.delete(existing);
        }
    }


    public Board getBoard(int bidx) {
        return br.findByBidx(bidx);
    }
}
