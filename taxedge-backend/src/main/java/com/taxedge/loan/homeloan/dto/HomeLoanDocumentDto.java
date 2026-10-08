package com.taxedge.loan.homeloan.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class HomeLoanDocumentDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    // identity
    private byte[] panCardFile;
    private byte[] aadhaarCardFile;
    private byte[] passportPhotoFile;
    private byte[] addressProofFile;

    // income and banking
    private byte[] bankStatementsFile;
    private byte[] salarySlipsFile;
    private byte[] form16ItrFile;

    // property and collateral
    private byte[] agreementToSellFile;
    private byte[] buildingPlanFile;
    private byte[] titleDeedFile;
    private byte[] encumbranceCertificateFile;
    private byte[] downPaymentProofFile;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;
}
