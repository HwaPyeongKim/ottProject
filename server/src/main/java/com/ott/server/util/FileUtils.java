package com.ott.server.util;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

public class FileUtils {
    public static MultipartFile urlToMultipartFile(String imageUrl, String fileName) throws Exception {
        URL url = new URL(imageUrl);
        URLConnection connection = url.openConnection();
        try (InputStream inputStream = connection.getInputStream()) {
            return new MockMultipartFile(
                    fileName,
                    fileName,
                    connection.getContentType(),
                    inputStream
            );
        }
    }
}
