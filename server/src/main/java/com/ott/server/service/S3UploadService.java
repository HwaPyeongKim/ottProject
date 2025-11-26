package com.ott.server.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ott.server.entity.FileEntity;
import com.ott.server.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final AmazonS3 amazoneS3;
    private final FileRepository fr;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public int saveFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // 파일명 중복 방지 (UUID 적용)
        String newFilename = UUID.randomUUID() + "_" + originalFilename;
        // S3 저장 경로 (폴더/날짜/파일명)
        String key = "files/" + date + "/" + newFilename;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        amazoneS3.putObject(bucket, key, file.getInputStream(), metadata);

        // DB 저장 (fidx 자동 증가)
        FileEntity fe = new FileEntity();
        fe.setOriginalname(originalFilename);
        fe.setPath(key);
        fe.setSize((int) file.getSize());

        fr.save(fe);

        return fe.getFidx(); // 저장 후 자동 생성된 PK 반환

        // 업로드된 파일의 경로와 이름 리턴
        // return amazoneS3.getUrl(bucket, originalFilename).toString();
    }

    // fidx 로 파일 정보 조회
    public FileEntity getFile(int fidx) {
        return fr.findById(fidx).orElse(null);
    }

    // 실제 접근 가능한 URL 생성
    public String getFileUrl(String key) {
        return amazoneS3.getUrl(bucket, key).toString();
    }

    // 여러 파일 ID를 받아 URL 목록 반환
    public Map<String, String> getFileUrls(java.util.List<String> fidxStrings) {

        // 1. 결과 Map 정의 (Key: String Fidx, Value: String URL)
        Map<String, String> urlMap = new HashMap<>();

        // 2. String Fidx List를 Integer Fidx List로 변환 (DB PK 조회를 위함)
        List<Integer> fidxs = fidxStrings.stream()
                //  문자열을 정수로 변환하여 Integer List를 생성
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        // 3. 모든 FileEntity를 한 번의 DB 쿼리로 조회 (N+1 해결)
        java.util.List<FileEntity> files = fr.findAllById(fidxs);

        // 4. 경로(path)를 URL로 변환하여 Map에 저장
        for (FileEntity file : files) {
            // DB에서 조회된 Integer Fidx를 다시 String으로 변환하여 Map의 Key로 사용
            String originalFidxString = String.valueOf(file.getFidx());

            // FileEntity에 저장된 S3 Key/Path를 이용해 실제 URL 생성
            String url = getFileUrl(file.getPath());

            urlMap.put(originalFidxString, url);
        }

        return urlMap;
    }
}
