package com.taxedge.gst.service;

import java.io.IOException;
import java.util.Base64;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.entity.Documents;
import com.taxedge.gst.enums.AddressProofType;
import com.taxedge.gst.enums.DocumentType;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.BusinessRepository;
import com.taxedge.gst.repository.DocumentsRepository;

@Service
public class DocumentsServiceImpl implements DocumentsService {

    private final DocumentsRepository documentsRepository;

    private final BusinessRepository businessRepository;

    public DocumentsServiceImpl(DocumentsRepository documentsRepository,BusinessRepository businessRepository) {
        this.documentsRepository = documentsRepository;
        this.businessRepository = businessRepository;
    }

    @Override
    public String uploadFile(String businessId,String documentType,String addressProofType,MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file");
        }

        businessRepository.findById(businessId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business not found with businessId: " + businessId));

        DocumentType type = DocumentType.valueOf(documentType);

        AddressProofType proofType = null;

        if (type == DocumentType.PRINCIPAL_PLACE_ADDRESS_PROOF) {

            if (addressProofType == null || addressProofType.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Address proof type is required for principal place address proof");
            }

            proofType = AddressProofType.valueOf(addressProofType);

        } else {

            if (addressProofType != null && !addressProofType.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Address proof type is allowed only for principal place address proof");
            }
        }

        byte[] fileBytes = file.getBytes();

        String base64Data = Base64.getEncoder().encodeToString(fileBytes);

        Documents document = new Documents();

        document.setBusinessId(businessId);
        document.setDocumentType(type);
        document.setAddressProofType(proofType);
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setImageData(base64Data);

        documentsRepository.save(document);

        return "Document uploaded successfully";
    }

    @Override
    public String updateFile(Long id,String documentType,String addressProofType,MultipartFile file) throws IOException {

        Documents document = documentsRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found with id: " + id));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file");
        }

        DocumentType type = DocumentType.valueOf(documentType);

        AddressProofType proofType = null;

        if (type == DocumentType.PRINCIPAL_PLACE_ADDRESS_PROOF) {

            if (addressProofType == null || addressProofType.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Address proof type is required for principal place address proof");
            }

            proofType = AddressProofType.valueOf(addressProofType);

        } else {

            if (addressProofType != null && !addressProofType.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Address proof type is allowed only for principal place address proof");
            }
        }

        byte[] fileBytes = file.getBytes();

        String base64Data = Base64.getEncoder().encodeToString(fileBytes);

        document.setDocumentType(type);
        document.setAddressProofType(proofType);
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setImageData(base64Data);

        documentsRepository.save(document);

        return "Document updated successfully";
    }

    @Override
    public String deleteFile(Long id) {

        Documents document = documentsRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found with id: " + id));

        documentsRepository.delete(document);

        return "Document deleted successfully";
    }
}