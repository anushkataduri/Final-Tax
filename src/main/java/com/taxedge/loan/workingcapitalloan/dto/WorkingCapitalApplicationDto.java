package com.taxedge.loan.workingcapitalloan.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.taxedge.loan.workingcapitalloan.enums.BusinessVintage;
import com.taxedge.loan.workingcapitalloan.enums.CreditPurpose;
import com.taxedge.loan.workingcapitalloan.enums.ExistingLoanStatus;
import com.taxedge.loan.workingcapitalloan.enums.FacilityType;
import com.taxedge.loan.workingcapitalloan.enums.ItrFilingStatus;
import com.taxedge.loan.workingcapitalloan.enums.WorkingCapitalApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkingCapitalApplicationDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

  

    private BigDecimal creditLimit;

    private CreditPurpose creditPurpose;

    private FacilityType facilityType;

    private ExistingLoanStatus existingBorrowingStatus;

    private BigDecimal monthlyInterestOutgo;

  

    private String businessName;

    private String gstin;

    private String udyamRegistrationNumber;

    private BusinessVintage operationalTrackRecord;

    private BigDecimal annualAuditedTurnover;

    private BigDecimal annualNetProfitBeforeTax;

    private String bankName;

    private String currentAccountNumber;

    private String ifscCode;

    private ItrFilingStatus itrFilingStatus;

    private String itrAcknowledgementNumber;


    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private WorkingCapitalApplicationStatus status;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;
}
