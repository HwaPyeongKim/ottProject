package com.ott.server.service;


import com.ott.server.dto.Paging;
import com.ott.server.entity.*;
import com.ott.server.repository.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository mr;
    private final ListEntityRepository ler;
    private final FollowRepository fr;
    private final DbListRepository dlr;
    private final ReviewRepository rr;
    private final BCommentRepository bcr;
    private final BoardRepository br;

    public Member checkEmail(String email) {
        return mr.findByEmail(email);
    }

    public Member checkNickname(String nickname) {
        return mr.findByNickname(nickname);
    }

    public void insertMember(Member member) {
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        member.setPwd(pe.encode(member.getPwd()));
        mr.save(member);
    }

    public Member getMember(String id) {
        return mr.findBySnsid(id);
    }

    public void updateMember(Member member) {
        Optional<Member> updateMember = mr.findByMidx(member.getMidx());
        Member mem = updateMember.get();
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        mem.setPwd(pe.encode(member.getPwd()));
        mem.setEmail(member.getEmail());
        mem.setNickname(member.getNickname());
        mem.setPhone(member.getPhone());
        mem.setZipnum(member.getZipnum());
        mem.setAddress1(member.getAddress1());
        mem.setAddress2(member.getAddress2());
        mem.setProfileimg(member.getProfileimg());
        mem.setProfilemsg(member.getProfilemsg());
    }

    public List<ListEntity> getList(int midx) {
        return ler.findByMidx(midx);
    }

    public HashMap<String, Object> getFollowings(int page, int midx) {
        //return fr.findByFromMember_Midx(midx);
        final String deleteYn = "N";
        HashMap<String , Object> result = new HashMap<>();
        if( (Integer)page == null || page < 1 ){
            result.put("followings", fr.findAllByFfromAndToMember_Deleteyn(midx, "N"));
        }else{
            Paging paging = new Paging();
            paging.setPage(page);

            //int count = fr.findAll().size();
            int count = fr.countByFfromAndToMember_Deleteyn(midx, "N");
            System.out.println("팔로우 카운트 : " + count);
            paging.setDisplayRow(10);
            paging.setDisplayPage(2);
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page - 1, paging.getDisplayRow() , Sort.by(Sort.Direction.DESC, "id"));
            Page<Follow> follows = fr.findByFfromAndToMember_Deleteyn(midx, "N", pageable);
            result.put("followings", follows.getContent());
            result.put("paging",  paging);
            result.put("totalFollowingsCount", count);
        }
        return result;
    }

    public HashMap<String, Object> getFollowers(int page, int midx) {
        //return fr.findByToMember_Midx(midx);
        final String deleteYn = "N";
        HashMap<String , Object> result = new HashMap<>();
        if( (Integer)page == null || page < 1 ){
            result.put("followers", fr.findAllByFtoAndFromMember_Deleteyn(midx, "N"));
        }else {
            Paging paging = new Paging();
            paging.setPage(page);

            //int count = fr.findAll().size();
            int count = fr.countByFtoAndFromMember_Deleteyn(midx, "N");
            System.out.println("팔로워 카운트 : " + count);
            paging.setDisplayRow(10);
            paging.setDisplayPage(2);
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page - 1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "id"));
            Page<Follow> follows = fr.findByFtoAndFromMember_Deleteyn(midx, "N", pageable);
            result.put("followers", follows.getContent());
            result.put("paging", paging);
            result.put("totalFollowersCount", count);
        }
        return result;
    }

    public Optional<Member> getFollowMember(int midx) {
        return mr.findByMidxAndDeleteynNot(midx, "Y");
    }

    public void insertFollow(Follow follow) {
        fr.save(follow);
    }

    public void deleteFollow(Follow follow) {
        fr.deleteByFfromAndFto(follow.getFfrom(), follow.getFto());
    }

    // 이메일 전송주체
    @Value("${spring.mail.username}")
    private static String senderEmail;
    private final JavaMailSender JMSender;
    private static int number;

    public int sendEmail(String email) {
        // 코드 발생
        number = (int)(Math.random() * (90000)) + 100000;
        // 수신 이메일, 제목 내용 등등을 설정할 객체를 생성, 전송될 이메일 내용(수신자, 제목, 내용 등) 구성 객체
        MimeMessage message = JMSender.createMimeMessage();
        try {
            message.setFrom( senderEmail );  // 보내는 사람 설정
            message.setRecipients( MimeMessage.RecipientType.TO, email );  // 받는 사람 설정
            message.setSubject("오늘 뭐보지? [이메일 인증]");  // 제목 설정
            String body = "";
            body += "<h3>" + "요청하신 인증 번호입니다." + "</h3>";
            body += "<h1>" + number + "</h1>";
            body += "<h3>" + "인증번호를 입력하시고 회원가입을 해주세요." + "</h3>";
            message.setText(body,"UTF-8", "html");  // 본문 설정
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        JMSender.send(message);  // 구성 완료된 message 를  JMSender 로 전송
        return number;
    }

    public ListEntity getListView(int listidx) {
        return ler.findByListidx(listidx);
    }

    public HashMap<String, Object> getListDetailView(int page, int listidx) {
        System.out.println("디테일뷰 리스트idx : " + listidx);
        //HashMap<String, Object> result = new HashMap<>();
        //List<DbList> dbList = dlr.findByListidx(listidx);
        //System.out.println("getListDetailView : " + dbList);
        HashMap<String , Object> result = new HashMap<>();
        if( (Integer)page == null || page < 1 ){
            result.put("dbList", dlr.findAllByListidx(listidx, Sort.by(Sort.Direction.DESC, "id")));
            System.out.println("dbList : " + result.get("dbList"));
        }else {
            Paging paging = new Paging();
            paging.setPage(page);

            //int count = fr.findAll().size();
            int count = dlr.countByListidx(listidx);
            System.out.println("리스트 타이틀 카운트 : " + count);
            paging.setDisplayRow(32);
            paging.setDisplayPage(2);
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page - 1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "id"));
            Page<DbList> dblist = dlr.findByListidx(listidx, pageable);
            result.put("dbList", dblist.getContent());
            System.out.println("dbList : " + dblist.getContent());
            result.put("paging", paging);
        }
        return result;
    }

    public DbList insertDbList(int dbidx, int listidx) {
        DbList dbList = new DbList();
        dbList.setDbidx(dbidx);
        dbList.setListidx(listidx);
        return dlr.save(dbList);
    }

    public Member getKakaoUser(String snsid) {

        return mr.findBySnsid(snsid);
    }

    public void resetPwd(int midx, String pwd) {
        Optional<Member> optionalMember = mr.findByMidx(midx);
        Member mem = optionalMember.get();
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        mem.setPwd(pe.encode(pwd));
    }

    public HashMap<String, Object> checkPwd(int midx, String pwd) {
        HashMap<String, Object> result = new HashMap<>();
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        Optional<Member> optionalMember = mr.findByMidx(midx);
        Member mem = optionalMember.get();
        System.out.println("checkPwd mem : " + mem);
        if( mem != null ){
            boolean isPasswordMatch = pe.matches(pwd, mem.getPwd());
            if( isPasswordMatch ){
                result.put("msg", "ok");
            }else{
                result.put("msg", "no");
            }
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    public int[] getTitleList(int listidx) {
        List<DbList> dblist = dlr.findAllByListidx(listidx, Sort.by(Sort.Direction.DESC, "id"));
        return dblist.stream().mapToInt(DbList::getDbidx).toArray();
    }

    public boolean toggleTitle(DbList dbList) {
        boolean exists = dlr.existsByListidxAndDbidx(dbList.getListidx(), dbList.getDbidx());
        if( exists ){
            dlr.deleteByListidxAndDbidx(dbList.getListidx(), dbList.getDbidx());
            return false;
        }

        //DbList dbList = new DbList();
        dbList.setDbidx(dbList.getDbidx());
        dbList.setListidx(dbList.getListidx());
        dbList.setPosterpath(dbList.getPosterpath());
        dbList.setTitle(dbList.getTitle());
        dlr.save(dbList);

        return true;
    }

    public void deleteList(ListEntity listentity) {
        ListEntity le = ler.findByMidxAndListidx(listentity.getMidx(), listentity.getListidx());
        ler.delete(le);
    }

    public HashMap<String, Object> getReviewList(int page, int midx, String type) {
        HashMap<String , Object> result = new HashMap<>();

        final String deleteYn = "N";
        boolean isTypeFilter = (type != null && !type.equals("all"));

        if( (Integer)page == null || page < 1 ){
            List<Review> list;

            if (isTypeFilter) {
                list = rr.findAllByMidxAndTypeAndDeleteyn(midx, type, deleteYn, Sort.by(Sort.Direction.DESC, "writedate"));
            } else {
                list = rr.findAllByMidxAndDeleteyn(midx, deleteYn, Sort.by(Sort.Direction.DESC, "writedate"));
            }
            result.put("reviewList", list);
            //System.out.println("DB 리뷰리스트 : " + result.get("reviewList"));
        }else {
            Paging paging = new Paging();
            paging.setPage(page);

            int count = isTypeFilter
                    ? rr.countByMidxAndTypeAndDeleteyn(midx, type, deleteYn)
                    : rr.countByMidxAndDeleteyn(midx, deleteYn);
            System.out.println("리스트 타이틀 카운트 : " + count);
            paging.setDisplayRow(24);
            paging.setDisplayPage(2);
            paging.setTotalCount(count);
            paging.calPaging();
            Pageable pageable = PageRequest.of(page - 1, paging.getDisplayRow(), Sort.by(Sort.Direction.DESC, "writedate"));
            Page<Review> list = isTypeFilter
                    ? rr.findByMidxAndTypeAndDeleteyn(midx, type, deleteYn, pageable)
                    : rr.findByMidxAndDeleteyn(midx, deleteYn, pageable);
            System.out.println("DB 리뷰리스트 : " + list);
            result.put("reviewList", list.getContent());
            result.put("paging", paging);
        }
        return result;
    }

    public HashMap<String, Object> getCheckMember(int midx) {
        HashMap<String, Object> result = new HashMap<>();
        Optional<Member> mem = mr.findByMidx(midx);
        result.put("checkMember", mem);
        return result;
    }

    public void editKakao(Member member) {
        Member mem = mr.findBySnsid(member.getSnsid());
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        if(mem != null){
            mem.setEmail(member.getEmail());
            mem.setPwd(pe.encode("EDITKAKAO"));
            mem.setName(member.getName());
            mem.setNickname(member.getNickname());
            mem.setPhone(member.getPhone());
            mem.setZipnum(member.getZipnum());
            mem.setAddress1(member.getAddress1());
            mem.setAddress2(member.getAddress2());
            mem.setProfileimg(member.getProfileimg());
            mem.setProfilemsg(member.getProfilemsg());
            mem.setRole(1);
        }
    }

    public Member getSnsMember(String snsid) {
        Member member = mr.findBySnsid( snsid );
        if( member != null ){
            return member;
        }else{
            return null;
        }

    }

    public void deleteTitle(int listidx, int dbidx) {
        DbList dl = dlr.findByListidxAndDbidx(listidx, dbidx);
        dlr.delete(dl);
    }

    public void deleteMember(Member member) {
        Optional<Member> mem = mr.findByMidx(member.getMidx());
        if (mem.isPresent()) {
            Member deleteMem = mem.get();
            deleteMem.setEmail(null);
            deleteMem.setPwd(null);
            deleteMem.setPhone(null);
            deleteMem.setName(null);
            deleteMem.setNickname(null);
            deleteMem.setZipnum(null);
            deleteMem.setAddress1(null);
            deleteMem.setAddress2(null);
            deleteMem.setProfileimg(null);
            deleteMem.setProfilemsg(null);
            deleteMem.setSnsid(null);
            deleteMem.setDeleteyn("Y");
            mr.save(deleteMem);
        }
    }

    public void deleteBcomment(Member member) {
        List<BComment> bcomment = bcr.findByMember_Midx(member.getMidx());
        if( bcomment != null){
            for( BComment comment : bcomment ){
                comment.setDeleteyn("Y");
                bcr.save(comment);
            }
        }
    }

    public void deleteReview(Member member) {
        List<Review> review = rr.findByMember_Midx(member.getMidx());
        if( review != null ){
            for ( Review rv : review ) {
                rv.setDeleteyn("Y");
                rr.save(rv);
            }
        }
    }

    public void deleteBoard(Member member) {
        List<Board> board = br.findByBoardMember_Midx(member.getMidx());
        if(board != null){
            for( Board b : board ){
                b.setStatus(BoardStatus.DELETED);
                br.save(b);
            }
        }
    }

    public void moveList(List list) {
        ler.fin
    }
}
