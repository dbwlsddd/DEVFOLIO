package com.devfolio.server.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    // 프로젝트 루트 경로 밑에 uploads 폴더 생성
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    public String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return null;
        }

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs(); // 폴더 없으면 생성
        }

        String originalFilename = file.getOriginalFilename();
        // 파일명 중복 방지를 위해 UUID 붙임
        String savedFilename = UUID.randomUUID() + "_" + originalFilename;
        File dest = new File(uploadDir + savedFilename);

        file.transferTo(dest); // 파일 저장

        return "/uploads/" + savedFilename; // 접근 가능한 URL 경로 반환
    }
}