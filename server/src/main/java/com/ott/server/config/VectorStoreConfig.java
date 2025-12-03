package com.ott.server.config;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class VectorStoreConfig {

    @Bean
    public VectorStore vectorStore(JdbcTemplate postgresJdbcTemplate,
                                   EmbeddingModel embeddingModel) {

        return PgVectorStore.builder(postgresJdbcTemplate, embeddingModel)
                .initializeSchema(true)   // ★ 스키마/테이블/인덱스 자동 생성 유지
                .build();
    }

}
