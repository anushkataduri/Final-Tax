package com.taxedge.itr.taxnotice.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxNoticeAssistanceDto {

    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotBlank(message = "Permanent Account Number is required")
    private String permanentAccountNumber;

    @NotBlank(message = "Assessment year is required")
    private String assessmentYear;

    @NotBlank(message = "Notice type/section is required")
    private String noticeTypeSection;

    @NotNull(message = "Notice date is required")
    private LocalDate noticeDate;

    @NotBlank(message = "Notice reference number/DIN is required")
    private String noticeReferenceNumberDin;

    @NotNull(message = "Response due date is required")
    private LocalDate responseDueDate;

    private String message;

    private byte[] noticeDocument;
}
