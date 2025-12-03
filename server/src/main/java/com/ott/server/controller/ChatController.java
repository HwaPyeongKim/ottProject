package com.ott.server.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
public class ChatController {

    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public ChatController(VectorStore vectorStore, ChatClient.Builder chatClient) {
        this.vectorStore = vectorStore;
        this.chatClient = chatClient.build();
    }

    @PostMapping("/question")
    public HashMap<String, Object> sendQuestion(@RequestParam("question") String question) {
        HashMap<String, Object> map = new HashMap<>();
        System.out.println(question);

        List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(question)              // 검색할 질의
                        .similarityThreshold(0.5)     // 유사도 임계값
                        .topK(3)                      // 가져올 문서 개수
                        .build()
        );
        String template = """
                당신은 쇼핑몰의 관리직원입니다. 문맥에 따라 고객의 질문에 정중하게 답변해 주십시오. 
                컨텍스트가 질문에 대답할 수 없는 경우 '해당 질문에 대해서는 챗봇 응답이 준비되어 있지 않습니다. 1588-0000 으로 문의 주시면 자세한 안내드리겠습니다'라고 대답하세요.
                               
                컨텍스트:
                 {context}
                 질문: 
                 {question}
                 
                 답변:
                """;

        System.out.println(results.size());

        String answer = chatClient.prompt()
                .user(promptUserSpec -> promptUserSpec.text(template)
                        .param("context", results)
                        .param("question", question))
                .call()
                .chatResponse()
                .getResult()
                .getOutput()
                .getText();

        map.put("answer", answer);
        return map;
    }
}
