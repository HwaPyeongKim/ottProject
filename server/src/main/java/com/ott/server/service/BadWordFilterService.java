package com.ott.server.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BadWordFilterService {

    // 금지 단어 리스트 (원하는 만큼 추가 가능)
    private final List<String> badWords = List.of(
            "씨발", "시발", "ㅅㅂ", "씹", "좆", "존나",
            "병신", "ㅄ", "개새끼", "새끼", "fuck", "shit"
    );

    // 게시판에서 자주 쓰이는 우회 욕설 패턴 (거리 제한 0~5)
    private final Pattern[] badPatterns = new Pattern[]{
            Pattern.compile("씨.{0,5}발"),
            Pattern.compile("시.{0,5}발"),
            Pattern.compile("병.{0,5}신"),
            Pattern.compile("존.{0,5}나"),
            Pattern.compile("개.{0,5}새끼")
    };

    // 비속어 포함 여부 검사

    public boolean containsBadWord(String text) {

        // 비어 있으면 false 반환
        if (text == null || text.trim().isEmpty()) {
            return false;
        }

        // HTML 태그 제거
        String noHtml = text.replaceAll("<[^>]*>", " ");

        // HTML 엔티티 처리 → &nbsp; 같은 것 제거
        noHtml = noHtml.replaceAll("&nbsp;", " ");

        // 대소문자 제거 + 공백 제거 (시 발 → 시발로 인식)
        String normalized = noHtml.toLowerCase()
                .replaceAll("\\s+", "")          // 일반 공백 제거
                .replaceAll("[\\p{Z}\\p{C}]+", "");  // 유니코드 공백 + 제어문자 제거

        // badWords 리스트의 모든 단어를 하나씩 검사
        for (String badWord : badWords) {
            // normalized 안에 badWord가 포함되어 있으면 → 비속어 포함
            if (normalized.contains(badWord)) {
                return true;
            }
        }

        for (Pattern pattern : badPatterns) {
            Matcher matcher = pattern.matcher(normalized);
            if (matcher.find()) {
                return true;
            }
        }

        // 한 번도 발견되지 않으면 비속어 없음
        return false;
    }
}
