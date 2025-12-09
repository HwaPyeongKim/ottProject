package com.ott.server.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class ShopLoader {

    private final VectorStore vectorStore; // postgres 총괄 관리 객체
    private final JdbcClient jdbcClient; // jdbc를 통해 데이터베이스에 access

    @Value("classpath:contract.txt")  // 단일 리소스
    private Resource resource;

    @PostConstruct
    public void init() throws InterruptedException, IOException {
        Integer count = jdbcClient.sql("select count(*) from vector_store")
                .query(Integer.class)
                .single();

        System.out.println("No of Records in the PG Vector Store=" + count);

        if (count == 0) {
            TextSplitter textSplitter = new TokenTextSplitter();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
                List<Document> documents = reader.lines()
                        .map(Document::new)
                        .collect(Collectors.toList());

                for (Document document : documents) {
                    List<Document> splitteddocs = textSplitter.split(document);
                    vectorStore.add(splitteddocs);
                    System.out.println("Added document from: " + resource.getFilename());
                    Thread.sleep(100);
                }
            }

            System.out.println("Application is ready to Serve the Requests");
        }
    }
}