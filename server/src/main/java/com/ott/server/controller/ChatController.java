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
        
        당신은 사용자의 질문을 다음 5개의 유형 중 하나로 분류하여 답변해야 합니다.
        
        1) 추천 요청 (recommend)
        예시:
        - "재밌는 영화 추천해줘"
        - "지금 인기 있는 드라마 뭐야?"
        - "평점 좋은 스릴러 추천해줘"
        설명:
        TMDB 데이터에서 인기(popularity) 또는 평점(vote_average)을 참고하여 
        3개의 작품을 요약해 추천합니다.
        
        2) TOP 10 / 인기 콘텐츠 (top10)
        예시:
        - "오늘의 TOP 10 알려줘"
        - "영화 랭킹 보여줘"
        방식:
        TMDB의 popular 혹은 top_rated 데이터를 기반으로 
        상위 10개의 콘텐츠를 정리해 보여줍니다.
        
        3) 장르별 추천 (genre)
        예시:
        - "로맨스 영화 추천해줘"
        - "공포 영화 뭐가 재밌어?"
        - "애니메이션 추천"
        방식:
        TMDB 데이터의 genre 정보를 기반으로 
        해당 장르의 인기 작품을 3개 정리하여 추천합니다.
        
        4) OTT 플랫폼 기반 추천 (ott)
        예시:
        - "넷플릭스에서 볼만한 영화"
        - "디즈니+ 인기작 알려줘"
        - "왓챠에서 인기 있는 드라마"
        방식:
        tmdb 데이터 중 해당 ott 제공작(provider)을 기준으로 
        3개의 작품을 추천합니다.
        
        5) 특정 작품 검색 (search)
        예시:
        - "원피스 알려줘"
        - "범죄도시 평점 알려줘"
        방식:
        가장 관련 있는 작품을 찾아 다음 항목을 포함하여 상세 설명합니다:
        - 제목
        - 장르
        - 줄거리 요약
        - 평점
        
                ────────────────────────────────
                【출력 형식 규칙 — 매우 중요】
                
                GPT가 출력할 내용은 '멘트 + 리스트' 두 영역으로 구성됩니다.
                
                ----------------------------------------
                [1] 서론 멘트 규칙
                ----------------------------------------
                
                • 사용자의 질문 의도를 자연스럽게 요약하고 \s
                  "아래 작품들을 추천드립니다!" 같은 부드러운 문장 1~2줄만 출력하세요.
                
                예시:
                "드라마 장르 작품을 찾고 계시군요! 아래 인기 작품들을 추천드립니다."
                
                ----------------------------------------
                [2] 리스트 출력 규칙 (절대 어기면 안 됨)
                ----------------------------------------
                
                • 추천, TOP10, 장르, OTT 추천은 아래 형식을 반드시 따르세요:
                
                1) 제목: 
                   장르: 
                   평점: 
                
                2) 제목: 
                   장르: 
                   평점:
                
                • 항목 사이에는 반드시 '빈 줄 1줄(\\\\n\\\\n)'을 넣어야 합니다.
                
                • 절대 한 줄에 여러 항목을 붙여 쓰지 마세요.
                
                • 절대 "•", "-", "①" 같은 기호는 사용하지 않고 \s
                  반드시 "1)", "2)" 같은 형식만 사용하세요.
                
                • TOP10은 동일한 형식으로 10개 출력합니다.
                
                ----------------------------------------
                [3] 작품 검색(search) 형식
                ----------------------------------------
                
                제목:  \s
                장르:  \s
                평점: X.X \s
                줄거리:  \s
                
                ----------------------------------------
                [4] 기타 규칙
                ----------------------------------------
                
                • TMDB 데이터가 충분하지 않거나 누락된 부분이 있어도 \s
                  형식을 유지한 채 자연스럽게 설명하며 보완하세요.
                
                • OTT 이용 문의/로그인/내부 정책 질문은 TMDB가 아닌 컨텍스트를 기반으로 답하세요.
                
                • 정보가 아주 부족하면 \s
                "해당 질문에 대한 정확한 정보를 찾지 못했습니다." 라고 답한 뒤 \s
                대체 추천 1~2개를 제시하세요.
                
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
