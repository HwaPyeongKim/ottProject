package com.ott.server.security.handler;

import com.google.gson.Gson;
import com.ott.server.dto.MemberDTO;
import com.ott.server.security.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

public class APILoginSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("성공핸들러");
        // 로그인이 성공했을때 실행되는 메서드
        // 토큰을 만들고 로그인유저 정보와함꼐 클라이언트로 전송해줍니다

        // authentication에서 MemberDTO를 꺼냅니다
        MemberDTO memberDTO = (MemberDTO)authentication.getPrincipal();

        // getClaims 를 이용해서 사용자 정보를 Map 형태로 추출 : 토큰 생성용 자료
        Map<String, Object> claims = memberDTO.getClaims();

        // 사용장정보가 들어있는 Map 자료(claims)를 이용하여 토큰을 생성
        String accessToken = JWTUtil.generateToken(claims, 1);
        String refreshToken = JWTUtil.generateToken(claims, 60*24);

        // 만든 토큰을 사용자정보가 들어 있는 claims에 추가합니다
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        // 클라이언트로 claims 를 전송(JSON 형식)
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);  // claims에 있는 데이터를 json형태로 변환
        response.setContentType("application/json");  // response 에 전송될 데이터형을 설정
        response.setCharacterEncoding("UTF-8");   // 한글 인코딩 설정
        PrintWriter printWriter = response.getWriter();  // 출력도구를 얻어서
        printWriter.println(jsonStr);  // 얻어낸 도구로 출력  -> 전송
        printWriter.close();

    }
}
