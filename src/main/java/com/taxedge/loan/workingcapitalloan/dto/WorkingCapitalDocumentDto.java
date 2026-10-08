package com.taxedge.loan.workingcapitalloan.dto;

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
public class WorkingCapitalDocumentDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private byte[] panCardFile;
    private byte[] aadhaarCardFile;
    private byte[] kycDirectorsFile;

  
    private byte[] bankStatementFile;


    private byte[] gstCertificateFile;
    private byte[] gstReturnsFile;
    private byte[] businessItrFile;
    private byte[] auditedBalanceSheetFile;
    private byte[] profitLossStatementFile;
    private byte[] udyamCertificateFile;
    private byte[] businessRegistrationProofFile;


    private byte[] existingLoanSanctionLetterFile;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;
}
