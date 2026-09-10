package com.taxedge.gst.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentsService {

    String uploadFile(String businessId,String documentType,String addressProofType,MultipartFile file) throws IOException;

    String updateFile(Long id,String documentType,String addressProofType,MultipartFile file) throws IOException;

    String deleteFile(Long id);
}