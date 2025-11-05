package com.ott.server.security;

import com.ott.server.security.filter.JWTCheckFilter;
import com.ott.server.security.handler.APILoginFailHandler;
import com.ott.server.security.handler.APILoginSuccessHandler;
import com.ott.server.security.handler.CustomAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CustomSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("Security Filter Chain - Security Config Start------------------------------------------------");

        // cors
        http.cors(
                httpSecurityCorsConfigurer -> {
                    httpSecurityCorsConfigurer.configurationSource(  corsConfigurationSource()  );
                }
        );

        // csrf - 토큰사용 O  &  세션사용 X    ->  scurity csrf 기능은 사용하지 않음
        http.csrf(config -> config.disable());

        http.formLogin(
                config ->{
                    config.loginPage("/member/login");
                    // -> security / service / CustomUserDetailServicee 안의 loadUserByUsername 메서드를 호출
                    config.successHandler( new APILoginSuccessHandler() );
                    config.failureHandler( new APILoginFailHandler() );
                }
        );

        // 토큰체크 도구(환경) 설정
        http.addFilterBefore(new JWTCheckFilter(), UsernamePasswordAuthenticationFilter.class);

        // 에러처리-토큰, 로그인 이외의 예외처리에 대한 설정(예: 잘못된 양식의 요청(request) 등)
        http.exceptionHandling(config -> {
            config.accessDeniedHandler(new CustomAccessDeniedHandler());
        });

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 아이피
        configuration.setAllowedOriginPatterns( Arrays.asList("*") );
        // 메서드방식
        configuration.setAllowedMethods( Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE") );
        // 헤더
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        // 전송해줄 데이터의 JSON 처리
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
