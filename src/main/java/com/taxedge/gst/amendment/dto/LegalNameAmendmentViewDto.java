package com.taxedge.gst.amendment.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LegalNameAmendmentViewDto {
    
    private Long id;
    private String newLegalName;
    private byte[] imageData;
    private String businessGstId;
    private String gstNumber;
    private String customerId;
}
