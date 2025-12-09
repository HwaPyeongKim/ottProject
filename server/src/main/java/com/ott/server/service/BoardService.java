package com.ott.server.service;

import com.ott.server.dto.Paging;
import com.ott.server.entity.*;
import com.ott.server.repository.BCommentRepository;
import com.ott.server.repository.BLikesRepository;
import com.ott.server.repository.BoardRepository;
import com.ott.server.repository.ReportRepository;
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
    private final ReportRepository rr;
    private final BCommentRepository bcr;

    public HashMap<String, Object> getBoardList(int page, String searchWord, String sortType) {
        HashMap<String, Object> result = new HashMap<>();

        Paging paging = new Paging();
        paging.setPage(page);
        paging.setDisplayPage(5);
        paging.setDisplayRow(5);

        long count; // 총 글 개수
        Pageable pageable;

        // 정렬 기준 결정
        Sort sort;
        if ("popular".equals(sortType)) {
            // 좋아요 많은 순 → 작성일 내림차순
            sort = Sort.by(Sort.Direction.DESC, "likecount").and(Sort.by(Sort.Direction.DESC, "writedate"));
        } else {
            // 최신순
            sort = Sort.by(Sort.Direction.DESC, "writedate");
        }

        pageable = PageRequest.of(page - 1, paging.getDisplayRow(), sort);

        // 검색어 처리
        if (searchWord == null || searchWord.trim().isEmpty()) {
            count = br.count(); // 전체 글 개수
            paging.setTotalCount((int) count);
            paging.calPaging();
            Page<Board> list = br.findAll(pageable);
            result.put("boardList", list.getContent());
        } else {
            count = br.countByTitleContainingOrContentContainingOrBoardMember_NicknameContaining(
                    searchWord, searchWord, searchWord);
            paging.setTotalCount((int) count);
            paging.calPaging();
            Page<Board> list = br.findAllByTitleContainingOrContentContainingOrBoardMember_NicknameContaining(
                    searchWord, searchWord, searchWord, pageable);
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

//        System.out.println("==== addlike() 실행 ====");
//        System.out.println("요청 데이터: bidx=" + blikes.getBidx() + ", midx=" + blikes.getMidx());

        BLikes existing = blr.findByBidxAndMidx(blikes.getBidx(), blikes.getMidx());
//        System.out.println("existing = " + existing);

        Board board = br.findById(blikes.getBidx())
                .orElseThrow(() -> new RuntimeException("Board not found"));

//        System.out.println("현재 board.likecount = " + board.getLikecount());

        if (existing == null) {
//            System.out.println("➡ 좋아요 신규 추가!");
            blr.save(blikes);
            board.setLikecount(board.getLikecount() + 1);
        } else {
//            System.out.println("➡ 좋아요 취소(삭제)!");
            blr.delete(existing);
            board.setLikecount(board.getLikecount() - 1);
        }

//        System.out.println("변경된 likecount = " + board.getLikecount());
        br.save(board);
//        System.out.println("board 저장 완료");
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
        if (board == null) {
            throw new RuntimeException("게시글 없음");
        }

        List<BComment> comments = bcr.findByBoard(board);  // board에 달린 모든 댓글 가져오기
        bcr.deleteAll(comments);

        br.delete(board);
    }

    public void reportBoard(int bidx, int midx) {
        Board board = br.findByBidx(bidx);
        if(board == null) {
            throw new RuntimeException("게시글이 존재하지 않습니다");
        }

        // 중복 신고 방지
        if(rr.existsByBidxAndMidx(bidx, midx)) {
            throw new RuntimeException("이미 신고한 게시글입니다");
        }

        // 신고 정보 저장
        Report report = new Report();
        report.setBidx(bidx);
        report.setMidx(midx);
        rr.save(report);

        board.setReportcount(board.getReportcount() + 1);

        if(board.getReportcount() >= 5 && board.getStatus() == BoardStatus.NORMAL) {
            board.setStatus(BoardStatus.BLURRED);
        }

        br.save(board);
    }

    public boolean isReported(int bidx, int midx) {
        return rr.existsByBidxAndMidx(bidx, midx);
    }


    public Board getTopBoard() {
        Board board = br.findTopByStatusOrderByLikecountDesc(BoardStatus.NORMAL);

        if (board != null && board.getBoardMember() != null) {
            board.getBoardMember().getNickname(); // Lazy 초기화
        }

        return board;
    }
}
