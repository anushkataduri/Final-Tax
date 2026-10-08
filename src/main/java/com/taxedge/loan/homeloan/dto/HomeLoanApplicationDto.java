package com.taxedge.loan.homeloan.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.taxedge.loan.homeloan.enums.EmploymentProfile;
import com.taxedge.loan.homeloan.enums.ExistingLoanStatus;
import com.taxedge.loan.homeloan.enums.HomeLoanApplicationStatus;
import com.taxedge.loan.homeloan.enums.ItrFilingStatus;
import com.taxedge.loan.homeloan.enums.MonthlyIncomeRange;
import com.taxedge.loan.homeloan.enums.PropertyConstructionStage;
import com.taxedge.loan.homeloan.enums.PropertyIntent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeLoanApplicationDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    private BigDecimal loanAmount;

    private PropertyIntent propertyIntent;

    private Integer tenureMonths;

    private PropertyConstructionStage constructionStage;

    private BigDecimal propertyCost;

    private EmploymentProfile employmentProfile;

    private MonthlyIncomeRange monthlyIncomeRange;

    private ExistingLoanStatus existingLoanStatus;

    private BigDecimal ongoingMonthlyEmi;

    private String bankName;

    private String bankAccountNumber;

    private String ifscCode;

    private ItrFilingStatus itrFilingStatus;

    private String itrAcknowledgementNumber;

    private BigDecimal grossTotalIncome;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private HomeLoanApplicationStatus status;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;
}
