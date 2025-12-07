package com.ott.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

@RestController
public class ChatController {

    @Value("${tmdb.api-key}")
    private String tmdbApiKey;

    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public ChatController(VectorStore vectorStore, ChatClient.Builder chatClient) {
        this.vectorStore = vectorStore;
        this.chatClient = chatClient.build();
    }

    //  실전 챗봇 API (Postgres + TMDB + GPT)
    @PostMapping("/question")
    public HashMap<String, Object> sendQuestion(@RequestParam("question") String question) {

        HashMap<String, Object> map = new HashMap<>();
        System.out.println(" 사용자 질문: " + question);

        //  1단계: RAG 검색
        List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(question)
                        .similarityThreshold(0.5)
                        .topK(3)
                        .build()
        );

//        String contextText = results.stream()
//                .map(Document::getText)
//                .reduce("", (a, b) -> a + "\n" + b);

        System.out.println(" RAG 결과 개수: " + results.size());

//  2단계: RAG 결과가 없을 때만 TMDB 호출
        String tmdbJson = "";
        if(results.isEmpty()) {
            try {
                String apiUrl = "https://api.themoviedb.org/3/search/tv"
                        + "?query=" + URLEncoder.encode(question, "UTF-8")
                        + "&language=ko-KR"
                        + "&api_key=" + tmdbApiKey;

                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<String> response =
                        restTemplate.getForEntity(apiUrl, String.class);

                tmdbJson = response.getBody();
                System.out.println(" TMDB 응답 원본 JSON = " + tmdbJson);

            } catch (Exception e) {
                System.out.println(" TMDB 호출 중 예외 발생");
                e.printStackTrace();
                tmdbJson = "TMDB 데이터 없음";
            }
        } else {
            System.out.println(" RAG 데이터가 존재하므로 TMDB는 호출하지 않음");
        }

//  람다용 final
        final String finalTmdbJson = tmdbJson;

        /* ================================
            3단계: GPT 프롬프트
         ================================= */
        String template = """
        당신은 OTT 통합 검색 서비스의 AI 챗봇입니다. 
        사용자의 질문을 분석하여 아래 기준에 따라 가장 적절한 방식으로 답변하세요.
        
        ────────────────────────────────
        【데이터 입력】
        ● 내부 컨텍스트 데이터 (OTT 서비스 공지/정책 등)
        {context}
        
        ● TMDB API로부터 가져온 영화/드라마 데이터
        {tmdb}
        
        ● 사용자 질문:
        {question}
        ────────────────────────────────
        
        【AI 행동 지침】
        
        사용자의 질문은 아래 5개의 유형 중 하나로 분류하여 답변하세요.
        
        1) 추천 요청 (recommend)
         - 예: "재밌는 영화 추천해줘", "지금 인기 있는 드라마 뭐야?"
         - TMDB의 평점 / 인기(popularity)를 참고해 3개 추천
        
        2) TOP 10 / 인기 콘텐츠 (top10)
         - popular/top_rated 기준 상위 10개 정리
        
        3) 장르별 추천 (genre)
         - 장르 관련 인기 작품 3개 추천
        
        4) OTT 플랫폼 기반 추천 (ott)
         - Netflix/Disney+/왓챠 등 provider 기준 추천 3개
        
        5) 특정 작품 검색 (search)
         - 제목, 장르, 평점, 줄거리 형식으로 상세 출력
         
        ────────────────────────────────
        【출력 형식 규칙 — 매우 중요】
        
        답변은 반드시 아래 두 부분으로 구성합니다:
        1) 부드러운 서론 멘트 1~2줄
        2) 번호 리스트 형태의 콘텐츠 정보
        
        ----------------------------------------
        [1] 서론 멘트 규칙
        ----------------------------------------
        • 질문 의도를 자연스럽게 요약한 1~2줄 멘트를 작성합니다.
        • 예: "드라마 장르 작품을 찾고 계시는군요! 아래 작품들을 추천드립니다."
        
        ----------------------------------------
        [2] 리스트 출력 규칙 (GPT가 반드시 지켜야 함)
        ----------------------------------------
        아래 형식을 그대로 사용해 주세요.
        
        1) 제목: (제목)
           장르: (장르)
           평점: (평점)
        
        2) 제목: (제목))
           장르: (장르)
           평점: (평점)
        
        • 모든 항목 사이에는 '빈 줄 1줄(\\n\\n)'을 반드시 넣습니다.  
        • 항목을 한 줄에 붙여 쓰지 않습니다.  
        • 불릿(•, -, ① 등)은 절대 사용하지 않고, 반드시 "1)", "2)" 형식을 사용합니다.  
        • TOP10일 경우 동일 형식으로 10개 출력합니다.  
        
        ----------------------------------------
        [3] 특정 작품 검색(search)일 때 형식
        ----------------------------------------
        제목:  
        장르:  
        평점: X.X  
        줄거리:  
        
        ----------------------------------------
        [4] 기타 규칙
        ----------------------------------------
        • TMDB 데이터가 부족해도 형식을 유지한 채 자연스럽게 보완합니다.  
        • OTT/로그인/내부 정책 관련 질문은 context 기반으로 답변합니다.  
        • 정보를 찾지 못하면:
          "해당 질문에 대한 정확한 정보를 찾지 못했습니다."  
          이후 대체 추천 1~2개 제공.
        
        ────────────────────────────────
        【최종 답변 시작】
        """;




        /* ================================
            4단계: GPT 호출
         ================================= */
        String answer = chatClient.prompt()
                .user(promptUserSpec -> promptUserSpec
                        .text(template)
                        .param("context", results)
                        .param("question", question)
                        .param("tmdb", finalTmdbJson)
                )
                .call()
                .chatResponse()
                .getResult()
                .getOutput()
                .getText();

        map.put("answer", answer);
        return map;
    }
}
