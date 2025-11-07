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
import java.util.UUID;


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
}
