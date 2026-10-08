package com.taxedge.loan.vehicleloan.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.taxedge.loan.vehicleloan.enums.EmploymentProfile;
import com.taxedge.loan.vehicleloan.enums.ExistingLoanStatus;
import com.taxedge.loan.vehicleloan.enums.ItrFilingStatus;
import com.taxedge.loan.vehicleloan.enums.VehicleCategory;
import com.taxedge.loan.vehicleloan.enums.VehicleCondition;
import com.taxedge.loan.vehicleloan.enums.VehicleLoanApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleLoanApplicationDto {

    private String id;

   
    private BigDecimal loanAmount;
    private VehicleCategory vehicleCategory;
    private Integer tenureMonths;
    private VehicleCondition vehicleCondition;
    private String vehicleMakeModel;
    private BigDecimal onRoadPrice;
    private BigDecimal downPayment;
    private String registrationNumber;
    private Integer registrationYear;

   
    private EmploymentProfile employmentProfile;
    private BigDecimal exactMonthlyIncome;
    private String legalBusinessName;
    private String gstin;
    private String udyamRegistrationNumber;
    private Integer businessVintageYears;
    private BigDecimal annualTurnover;
    private ExistingLoanStatus existingLoanStatus;
    private BigDecimal ongoingMonthlyEmi;

  
    private String bankName;
    private String bankAccountNumber;
    private String ifscCode;
    private String currentFinancingBank;
    private BigDecimal approxTotalOutstanding;
    private ItrFilingStatus itrFilingStatus;
    private String itrAcknowledgementNumber;
    private BigDecimal grossTotalAnnualIncome;

   
    private VehicleLoanApplicationStatus status;
    private LocalDateTime createdAt;
}
