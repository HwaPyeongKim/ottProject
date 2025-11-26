package com.ott.server.controller;

import com.google.gson.Gson;
import com.ott.server.dto.KakaoProfile;
import com.ott.server.dto.OAuthToken;
import com.ott.server.entity.*;
import com.ott.server.security.util.CustomJWTException;
import com.ott.server.security.util.JWTUtil;
import com.ott.server.service.MemberService;
import com.ott.server.service.S3UploadService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    MemberService ms;

    @Autowired
    S3UploadService sus;

    @PostMapping("/upload")
    public HashMap<String, Object> fileUpload(  @RequestParam("image") MultipartFile file ) {
        HashMap<String , Object> result = new HashMap<>();
        try{
            int fidx = sus.saveFile(file);
            FileEntity fileEntity = sus.getFile(fidx);

            result.put("fidx", fileEntity.getFidx());
            result.put("image", sus.getFileUrl(fileEntity.getPath()));
            result.put("filename", fileEntity.getOriginalname());
        }catch (IllegalStateException | IOException e){
            e.printStackTrace();
        }
        System.out.println("이미지 업로드 서버: " + result);
        return result;
    }

    @PostMapping("/emailcheck")
    public HashMap<String, Object> emailcheck(@RequestParam("email") String email){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.checkEmail(email);
        if(member == null){
            result.put("msg", "ok");
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    @PostMapping("/nicknamecheck")
    public HashMap<String, Object> nicknamecheck(@RequestParam("nickname") String nickname){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.checkNickname(nickname);
        if(member == null){
            result.put("msg", "ok");
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    @PostMapping("/join")
    public HashMap<String, Object> join(@RequestBody Member member){
        HashMap<String, Object> result = new HashMap<>();
//        member.setDeleteyn("N");
//        member.setProvider("LOCAL"); // LOCAL: 일반 , KAKAO: 카카오
        System.out.println("회원가입 전화번호 : " + member.getPhone());
        member.setRole(1); // 1: 일반 , 2: 관리자
        ms.insertMember(member);
        result.put("msg", "ok");
        return result;
    }

    @Value("${kakao.client_id}")
    private String client_id;
    @Value("${kakao.redirect_uri}")
    private String redirect_uri;

    @GetMapping("/kakaostart")
    public @ResponseBody String kakaostart() {
        String a = "<script type='text/javascript'>"
                + "location.href='https://kauth.kakao.com/oauth/authorize?"
                + "client_id=" + client_id + "&"
                + "redirect_uri=" + redirect_uri + "&"
                + "response_type=code';" + "</script>";
        return a;
    }

    @RequestMapping("/kakaoLogin")
    public void kakaoLogin(HttpServletRequest request, HttpServletResponse response ) throws IOException, MalformedURLException {
        String code = request.getParameter("code");
        String endpoint = "https://kauth.kakao.com/oauth/token";
        URL url = new URL(endpoint);
        String bodyData = "grant_type=authorization_code&";
        bodyData += "client_id=" + client_id + "&";
        bodyData += "redirect_uri=" + redirect_uri + "&";
        bodyData += "code=" + code;

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        conn.setDoOutput(true);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
        bw.write(bodyData);
        bw.flush();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String input = "";
        StringBuilder sb = new StringBuilder();
        while ((input = br.readLine()) != null) {
            sb.append(input);
        }
        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(sb.toString(), OAuthToken.class);
        String endpoint2 = "https://kapi.kakao.com/v2/user/me";
        URL url2 = new URL(endpoint2);

        HttpsURLConnection conn2 = (HttpsURLConnection) url2.openConnection();
        conn2.setRequestProperty("Authorization", "Bearer " + oAuthToken.getAccess_token());
        conn2.setDoOutput(true);
        BufferedReader br2 = new BufferedReader(new InputStreamReader(conn2.getInputStream(), "UTF-8"));
        String input2 = "";
        StringBuilder sb2 = new StringBuilder();
        while ((input2 = br2.readLine()) != null) {
            sb2.append(input2);
            System.out.println(input2);
        }
        Gson gson2 = new Gson();
        KakaoProfile kakaoProfile = gson2.fromJson(sb2.toString(), KakaoProfile.class);
        KakaoProfile.KakaoAccount ac = kakaoProfile.getAccount();
        KakaoProfile.KakaoAccount.Profile pf = ac.getProfile();
        System.out.println("id : " + kakaoProfile.getId());
        System.out.println("KakaoAccount-Email : " + ac.getEmail());
        System.out.println("Profile-Nickname : " + pf.getNickname());

        Member member = ms.getMember( kakaoProfile.getId() );
        if( member == null ){
            member = new Member();
            member.setSnsid( kakaoProfile.getId() );
            //member.setEmail( ac.getEmail() );
            member.setNickname( pf.getNickname() );
            member.setProfileimg( pf.getProfile_image_url());
            member.setPwd( "KAKAO" );
            member.setProvider( "KAKAO" );
            ms.insertMember(member);
        }
        response.sendRedirect("http://localhost:3000/kakaoIdLogin/"+member.getSnsid());

    }

    @GetMapping("/refresh/{refreshToken}")
    public HashMap<String, Object> refresh(
            @PathVariable("refreshToken") String refreshToken,
            @RequestHeader("Authorization") String authHeader
    ) throws CustomJWTException {
        HashMap<String, Object> result = new HashMap<>();
        if( refreshToken == null ) throw new CustomJWTException("NULL_REFRESH");
        if( authHeader == null || authHeader.length() < 7 )
            throw new CustomJWTException("INVALID_HEADER");

        // 추출한 내용의 7번째 글자부터 끝까지 추출
        String accessToken = authHeader.substring(7);

        // 유효시간이 지났는지 검사
        Boolean expAt = checkExpiredToken( accessToken );

        if( expAt){ // 유효기간이 지나지않았을때
            System.out.println("토큰 유효기간 아직 안지났습니다. 계속 사용합니다");
            result.put("accessToken", accessToken);
            result.put("refreshToken", refreshToken);

        }else{   // 유효기간이 지났을때
            System.out.println("토큰 유효기간이 지나서 경신합니다");

            // accessToken 기간 만료시  refresh 토큰으로 재 검증하여 사용자 정보 추출
            Map<String, Object> claims = JWTUtil.validateToken(refreshToken);

            // 새로운 accessToken 으로 교체
            String newAccessToken = JWTUtil.generateToken(claims, 1);

            // 리프레시토큰의 exp 를 꺼내서 현재 시간과 비교
            Integer exp = (Integer)claims.get("exp"); // refreshToken 의 유효시간 추출
            java.util.Date expDate = new java.util.Date( (long)exp * (1000 ));// 유요시간을 밀리초로 변환
            long gap = expDate.getTime() - System.currentTimeMillis(); // 현재 시간과의 차이 계산
            long leftMin = gap / (1000 * 60); //분단위 변환
            String newRefreshToken = "";
            // 기존 refreshToken의 유효기간이 한시간도 안남았다면 교체 , 아직 쓸만하다면 그데로 사용
            if( leftMin < 60 )   newRefreshToken = JWTUtil.generateToken(claims, 60*24);
            else newRefreshToken = refreshToken;
            result.put("accessToken", newAccessToken);
            result.put("refreshToken", newRefreshToken);
        }
        return result;
    }

    private Boolean checkExpiredToken(String accessToken) {
        try {
            JWTUtil.validateToken(accessToken);
        } catch (CustomJWTException e) {
            if( e.getMessage().equals("Expired") ){
                return false;
            }
        }
        return true;
    }

    @PostMapping("/updateMember")
    public HashMap<String, Object> updateMember(@RequestBody Member member) {
        HashMap<String, Object> result = new HashMap<>();
        ms.updateMember(member);
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/checkPwd")
    public HashMap<String, Object> checkPwd(@RequestParam("midx") int midx, @RequestParam("pwd") String pwd) {
        HashMap<String, Object> result = ms.checkPwd(midx, pwd);
        System.out.println("11111111111111111111111111111111111111111111111111111111111");
        System.out.println("checkPwd result : " + result.get("msg"));
        return result;
    }

    @PostMapping("/resetPwd")
    public HashMap<String, Object> resetPwd(@RequestParam("midx") int midx, @RequestParam("pwd") String pwd) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("222222222222222222222222222222222222222222222222222222");
        ms.resetPwd(midx, pwd);
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getList")
    public HashMap<String, Object> getList(@RequestParam("midx") int midx) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("myList", ms.getList(midx));
        result.put("msg", "ok");
        return result;
    }

    @DeleteMapping("/deleteList")
    public HashMap<String, Object> deleteList(@RequestBody ListEntity listentity) {
        HashMap<String, Object> result = new HashMap<>();
        ms.deleteList(listentity);
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getFollowings")
    public HashMap<String, Object> getFollowings(@RequestParam(value = "page", required = false, defaultValue = "") int page, @RequestParam("midx") int midx) {
        //HashMap<String, Object> result = new HashMap<>();
        System.out.println("팔로잉 호출");
        HashMap<String, Object> result = ms.getFollowings(page, midx);
        //result.put("followings", ms.getFollowings(page, midx));
        return result;
    }

    @GetMapping("/getFollowers")
    public HashMap<String, Object> getFollowers(@RequestParam(value = "page", required = false, defaultValue = "") int page, @RequestParam("midx") int midx) {
        System.out.println("팔로워 호출");
        //HashMap<String, Object> result = new HashMap<>();
        HashMap<String, Object> result = ms.getFollowers(page, midx);
        //result.put("followers", ms.getFollowers(page, midx));
        return result;
    }

    @GetMapping("/getFollowMember")
    public HashMap<String, Object> getFollowMember(@RequestParam("followMemberId") int midx) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("followMember", ms.getFollowMember(midx));
        return result;
    }

    @PostMapping("/follow")
    public HashMap<String, Object> followMember(@RequestBody Follow follow) {
        HashMap<String, Object> result = new HashMap<>();
        ms.insertFollow(follow);
        result.put("msg", "ok");
        return result;
    }

    @DeleteMapping("/nofollow")
    public HashMap<String, Object> deleteFollowMember(@RequestBody Follow follow) {
        HashMap<String, Object> result = new HashMap<>();
        ms.deleteFollow(follow);
        result.put("msg", "ok");
        return result;
    }

    private int number;

    @PostMapping("/sendMail")
    public HashMap<String, Object> sendMail(@RequestParam("email") String email){
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.checkEmail(email);
        if(member == null){
            number = ms.sendEmail(email);
            result.put("msg", "ok");
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    @PostMapping("/confirmCode")
    public HashMap<String, Object> confirmCode(@RequestParam("code") String code){
        HashMap<String, Object> result = new HashMap<>();
        if( Integer.parseInt( code ) == number ){
            result.put("msg", "ok");
        }else{
            result.put("msg", "no");
        }
        return result;
    }

    @GetMapping("/getMyListView")
    public HashMap<String, Object> getMyListView(@RequestParam("listidx") int listidx) {
        System.out.println("listidx = " + listidx);
        HashMap<String, Object> result = new HashMap<>();
        result.put("myListView", ms.getListView(listidx));
        return result;
    }

    @GetMapping("/getMyListDetailView")
    public HashMap<String, Object> getMyListDetailView(@RequestParam(required = false, value = "page", defaultValue = "") int page, @RequestParam("listidx") int listidx) {
        System.out.println("getMyListDetailView : " + page);
        System.out.println("listidx = " + listidx);
        HashMap<String, Object> result = ms.getListDetailView(page, listidx);
        System.out.println("getMyListDetailView : " + result.get("dbList"));
        return result;
    }

//    @GetMapping("/addTitleList/{dbidx}")
//    public HashMap<String, Object> addTitleList(@PathVariable("dbidx") int dbidx, @RequestParam("listidx") int listidx) {
//        System.out.println("타이틀 추가 -------------------------------------------" + dbidx + "---- 리스트아이디 ----" + listidx);
//        HashMap<String, Object> result = new HashMap<>();
//        ms.insertDbList(dbidx, listidx);
//        result.put("msg", "ok");
//        return result;
//    }

    @GetMapping("/titleList")
    public HashMap<String, Object> getTitleList(@RequestParam("listidx") int listidx) {
        HashMap<String, Object> result = new HashMap<>();
        result.put("titleList", ms.getTitleList(listidx));
        System.out.println("titleList = " + Arrays.toString((int[])result.get("titleList")));
        return result;
    }

    @PostMapping("/toggleTitle")
    public HashMap<String, Object> toggleTitle(@RequestBody DbList dblist) {
        HashMap<String, Object> result = new HashMap<>();
        boolean saved = ms.toggleTitle(dblist);
        result.put("saved", saved);
        return result;
    }

//    @PostMapping("/toggleTitle")
//    public HashMap<String, Object> toggleTitle(@RequestParam("listidx") int listidx, @RequestParam("dbidx") int dbidx) {
//        HashMap<String, Object> result = new HashMap<>();
//        boolean saved = ms.toggleTitle(listidx, dbidx);
//        result.put("saved", saved);
//        return result;
//    }

    @PostMapping("/getKakaoUser")
    public HashMap<String, Object> getKakaoUser(@RequestParam("snsid") String snsid, @RequestParam("password") String pwd) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("11111111111111111111111111111111111111111111111");
        System.out.println("pwd = " + pwd);
        if( pwd.equals("KAKAO") ){
            Member member = ms.getKakaoUser(snsid);
            System.out.println("member = " + member);
            if( member == null ){
                result.put("msg", "no");
            }else{
                result.put("KakaoUser", member);
                result.put("msg", "ok");
            }
        }
        return result;
    }


    @GetMapping("/getReviewList")
    public HashMap<String, Object> getReviewList(@RequestParam("midx") int midx) {
        HashMap<String, Object> result = new HashMap<>();
        List<Review> reviewList = ms.getReviewList(midx);
        result.put("reviewList", reviewList);
        return result;
    }
}
