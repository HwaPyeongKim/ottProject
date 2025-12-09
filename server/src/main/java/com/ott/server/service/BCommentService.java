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
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class BCommentService {

    private final MemberRepository mr;
    private final BoardRepository br;
    private final BCommentRepository cr;
    private final S3UploadService sus;

    public List<BCommentResponseDTO> getCommentList(int bidx) {
        Board boardEntity = br.findById(bidx).orElseThrow(() -> new RuntimeException("게시글 없음"));;
//        List<BComment> list = cr.findAllByBoardWithMember(boardEntity);
        List<BComment> list = cr.findAllActiveByBoardWithMember(bidx);
//        System.out.println("댓글 조회된 개수 = " + list.size());

        // N+1 해결을 위한 Bulk 데이터 통합 로직

        // 1. 모든 작성자의 프로필 이미지 ID 수집
        // Integer 대신 String으로 타입 변경 (Member Entity의 profileimg 타입에 맞춤)
        List<String> profileFidxList = new ArrayList<>();

        for (BComment c : list) {
            // profileFidx 타입을 String으로 변경하여 오류 해결
            String profileFidx = c.getMember().getProfileimg();

            if (profileFidx != null && !profileFidx.isEmpty()) { // String이므로 null 체크 후, 비어있는지 추가 확인
                profileFidxList.add(profileFidx);
            }
        }

        // 2. S3 URL Bulk 조회
        // sus.getFileUrls 메서드도 String List를 받도록 수정이 필요합니다.
        Map<String, String> urlMap = sus.getFileUrls(profileFidxList);

        // 3. Entity -> DTO 매핑 및 URL 주입
        List<BCommentResponseDTO> result = new ArrayList<>();

        for (BComment c : list) {
            BCommentResponseDTO resDto = BCommentMapper.toResponseDTO(c);

            // 프로필 이미지 URL 주입
            String profileFidx = c.getMember().getProfileimg();
            if (profileFidx != null && !profileFidx.isEmpty()) {
                String profileUrl = urlMap.getOrDefault(profileFidx, "/default.png");
                resDto.setMemberProfileUrl(profileUrl);
            } else {
                resDto.setMemberProfileUrl("/default.png");
            }

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

        // 해당 댓글 삭제
        comment.setDeleteyn("Y");
        cr.save(comment);

        // 댓글 삭제시 대댓글 제거
        if (comment.getPcidx() == null) {
            List<BComment> replies = cr.findByPcidxAndDeleteyn(comment.getBcidx(), "N");
            for (BComment reply : replies) {
                reply.setDeleteyn("Y");
            }
            cr.saveAll(replies);
        }
    }


}
