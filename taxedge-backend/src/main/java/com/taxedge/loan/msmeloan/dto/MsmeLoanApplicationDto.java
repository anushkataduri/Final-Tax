package com.taxedge.loan.msmeloan.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.taxedge.loan.msmeloan.enums.MsmeBusinessActivity;
import com.taxedge.loan.msmeloan.enums.MsmeConstitution;
import com.taxedge.loan.personalloan.enums.LoanApplicationStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MsmeLoanApplicationDto {

    private String id;
    private String custId;

    @NotBlank(message = "Business name is required")
    @Size(max = 150)
    private String businessName;

    private MsmeConstitution constitution;
    private MsmeBusinessActivity businessActivity;

    @NotNull(message = "Requested loan amount is required")
    @DecimalMin(value = "50000.00", message = "Requested loan amount must be at least 50000")
    private BigDecimal requestedLoanAmount;

    private Integer tenureMonths;
    private BigDecimal annualTurnover;
    private String yearsInBusiness;

    @Size(max = 30)
    private String udyamRegistrationNumber;

    @Size(max = 15)
    private String gstin;

    @Size(max = 10)
    private String panNumber;

    @Size(max = 100)
    private String primaryBankName;

    @Size(max = 30)
    private String accountNumber;

    @Size(max = 11)
    private String ifscCode;

    private LoanApplicationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
