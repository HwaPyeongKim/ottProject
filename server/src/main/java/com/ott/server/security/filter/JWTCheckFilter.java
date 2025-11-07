package com.ott.server.security.filter;

import com.google.gson.Gson;
import com.ott.server.dto.MemberDTO;
import com.ott.server.security.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class JWTCheckFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        // 전송된 요청(request)에 담긴 header 로 "사용자 정보"와 "토큰"을 점검
        String authHeaderStr = request.getHeader("Authorization");
        // axios.post('URL', null, {params:{}, header:{ 'Athoriztion':`Bearer ${accessToken}`  } )
        try{
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            System.out.println("JWT claims: " + claims);

            String email = (String) claims.get("email");
            String pwd = (String) claims.get("pwd");
            int midx = (int) claims.get("midx");
            String name = (String) claims.get("name");
            String nickname = (String) claims.get("nickname");
            String phone = (String) claims.get("phone");
            String zipnum = (String) claims.get("zipnum");
            String address1 = (String) claims.get("address1");
            String address2 = (String) claims.get("address2");
            String profileimg = (String) claims.get("profileimg");
            String profilemsg = (String) claims.get("profilemsg");
            String snsid = (String) claims.get("snsid");
            List<String> list = new ArrayList<>();
            list.add("USER");

            MemberDTO memberDTO = new MemberDTO( email, pwd, midx, name, nickname, phone, zipnum, address1, address2, profileimg, profilemsg, snsid, list  );

            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDTO, pwd , memberDTO.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);
        }catch(Exception e){
            System.out.println("JWT Check Error..............");
            System.out.println(e.getMessage());
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        System.out.println("check uri : " + path);

        if(request.getMethod().equals("OPTIONS")){return true;}
        if(path.startsWith("/member/emailcheck")){return true;}
        if(path.startsWith("/member/nicknamecheck")){return true;}
        if(path.startsWith("/member/join")){return true;}
        if(path.startsWith("/member/login")){return true;}
        if(path.startsWith("/member/refresh")){return true;}
        if(path.startsWith("/member/upload")){return true;}
        if(path.startsWith("/member/kakaostart")){return true;}
        if(path.startsWith("/member/kakaoLogin")){return true;}
        if(path.startsWith("/file/url")){return true;}
        if(path.startsWith("/favicon.ico")){return true;}
        if(path.startsWith("/board/getBoardList")){return true;}

        return false;
    }
}
