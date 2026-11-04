package com.taxedge.loan.machineryloan.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.taxedge.loan.machineryloan.enums.BusinessConstitution;
import com.taxedge.loan.machineryloan.enums.BusinessVintage;
import com.taxedge.loan.machineryloan.enums.MachineryLoanApplicationStatus;
import com.taxedge.loan.machineryloan.enums.MachineryType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MachineryLoanApplicationDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

  
    private BigDecimal loanAmount;
    private MachineryType machineryType;
    private Integer tenureMonths;


    private String businessName;
    private BusinessConstitution businessType;
    private BusinessVintage businessVintage;
    private BigDecimal annualTurnover;
    private Boolean gstRegistered;
    private String gstin;


    private String bankName;
    private String currentAccountNumber;
    private String ifscCode;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private MachineryLoanApplicationStatus status;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;
}
