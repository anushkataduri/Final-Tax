package com.taxedge.gst.dto;

import com.taxedge.gst.enums.AddressProofType;
import com.taxedge.gst.enums.DocumentType;

import lombok.Data;

@Data
public class DocumentsDto {

    private Long id;

    private String businessId;

    private DocumentType documentType;

    private AddressProofType addressProofType;

    private String fileName;

    private String fileType;
}