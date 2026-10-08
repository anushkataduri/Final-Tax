package com.taxedge.itr.taxnotice.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @Pattern(
        regexp = "^[A-Z]{5}[0-9]{4}[A-Z]$",
        message = "Invalid PAN number"
    )
    private String permanentAccountNumber;

    @NotBlank(message = "Assessment year is required")
    @Pattern(
        regexp = "^[0-9]{4}-[0-9]{2}$",
        message = "Assessment year must be in format YYYY-YY"
    )
    private String assessmentYear;

    @NotBlank(message = "Notice type/section is required")
    @Size(max = 255, message = "Notice type/section cannot exceed 255 characters")
    private String noticeTypeSection;

    @NotNull(message = "Notice date is required")
    private LocalDate noticeDate;

    @NotBlank(message = "Notice reference number/DIN is required")
    @Size(max = 100, message = "Notice reference number/DIN cannot exceed 100 characters")
    private String noticeReferenceNumberDin;

    @NotNull(message = "Response due date is required")
    private LocalDate responseDueDate;

    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;

    private byte[] noticeDocument;
}