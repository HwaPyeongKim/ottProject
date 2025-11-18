package com.ott.server.service;

import com.ott.server.dto.Paging;
import com.ott.server.entity.BComment;
import com.ott.server.entity.BLikes;
import com.ott.server.entity.Board;
import com.ott.server.repository.BCommentRepository;
import com.ott.server.repository.BLikesRepository;
import com.ott.server.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private final BCommentRepository bcr;

    public HashMap<String, Object> getBoardList(int page, String searchWord) {
        HashMap<String, Object> result = new HashMap<>();

        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(5);
        paging.setDisplayRow(5);
        if( searchWord.equals("") ) {
            int count = br.findAll().size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 5, Sort.by(Sort.Direction.DESC, "writedate"));
            Page<Board> list = br.findAll( pageable );
            result.put("boardList", list.getContent());
        }else{
            int count = br.findByTitleContainingOrContentContainingOrBoardMember_NicknameContaining(searchWord,searchWord,searchWord).size();
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page-1, 5, Sort.by(Sort.Direction.DESC, "writedate"));
            Page<Board> list = br.findAllByTitleContainingOrContentContainingOrBoardMember_NicknameContaining( searchWord, searchWord, searchWord, pageable );
            result.put("boardList", list.getContent());
        }
        result.put("paging", paging);
        return result;
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

    public void updateBoard(Board board) {
        Board updateBoard = br.findByBidx(board.getBidx());
        updateBoard.setTitle(board.getTitle());
        updateBoard.setContent(board.getContent());
        updateBoard.setFidx(board.getFidx());
        br.save(updateBoard);
    }

    public void deleteBoard(int bidx) {
        Board board = br.findByBidx(bidx);
        br.delete(board);
    }

    public Object getReplyList(int bidx) {
        List<BComment> list = bcr.findByBoard_BidxOrderByBcidxDesc(bidx);
        return list;
    }
}
