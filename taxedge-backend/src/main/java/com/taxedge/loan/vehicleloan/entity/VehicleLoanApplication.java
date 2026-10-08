package com.taxedge.loan.vehicleloan.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.taxedge.customer.entity.Customer;
import com.taxedge.loan.vehicleloan.enums.EmploymentProfile;
import com.taxedge.loan.vehicleloan.enums.ExistingLoanStatus;
import com.taxedge.loan.vehicleloan.enums.ItrFilingStatus;
import com.taxedge.loan.vehicleloan.enums.VehicleCategory;
import com.taxedge.loan.vehicleloan.enums.VehicleCondition;
import com.taxedge.loan.vehicleloan.enums.VehicleLoanApplicationStatus;
import com.taxedge.loan.vehicleloan.helper.VehicleLoanHelper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vehicle_loan_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleLoanApplication {

    @Id
    @Column(name = "vehicle_loan_id", nullable = false, updatable = false, length = 20)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_id",
                foreignKey = @ForeignKey(name = "fk_vehicle_loan_customer"))
    private Customer customer;



    @Column(name = "loan_amount")
    private BigDecimal loanAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_category", length = 40)
    private VehicleCategory vehicleCategory;

    @Column(name = "tenure_months")
    private Integer tenureMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_condition", length = 30)
    private VehicleCondition vehicleCondition;

    @Column(name = "vehicle_make_model", length = 150)
    private String vehicleMakeModel;

    @Column(name = "on_road_price")
    private BigDecimal onRoadPrice;

    @Column(name = "down_payment")
    private BigDecimal downPayment;
    
    @Column(name = "registration_number", length = 15)
    private String registrationNumber;

    @Column(name = "registration_year")
    private Integer registrationYear;



    @Enumerated(EnumType.STRING)
    @Column(name = "employment_profile", length = 30)
    private EmploymentProfile employmentProfile;

    @Column(name = "exact_monthly_income")
    private BigDecimal exactMonthlyIncome;
    
    @Column(name = "legal_business_name", length = 200)
    private String legalBusinessName;

    @Column(name = "gstin", length = 15)
    private String gstin;

    @Column(name = "udyam_registration_number", length = 30)
    private String udyamRegistrationNumber;

    @Column(name = "business_vintage_years")
    private Integer businessVintageYears;

    @Column(name = "annual_turnover", precision = 15, scale = 2)
    private BigDecimal annualTurnover;

    @Enumerated(EnumType.STRING)
    @Column(name = "existing_loan_status", length = 20)
    private ExistingLoanStatus existingLoanStatus;

    @Column(name = "ongoing_monthly_emi")
    private BigDecimal ongoingMonthlyEmi;

  

    @Column(name = "bank_name", length = 150)
    private String bankName;

    @Column(name = "bank_account_number", length = 30)
    private String bankAccountNumber;

    @Column(name = "ifsc_code", length = 11)
    private String ifscCode;



    @Column(name = "current_financing_bank", length = 150)
    private String currentFinancingBank;

    @Column(name = "approx_total_outstanding", precision = 15, scale = 2)
    private BigDecimal approxTotalOutstanding;

   

    @Enumerated(EnumType.STRING)
    @Column(name = "itr_filing_status", length = 20)
    private ItrFilingStatus itrFilingStatus;

    @Column(name = "itr_acknowledgement_number", length = 15)
    private String itrAcknowledgementNumber;

    @Column(name = "gross_total_annual_income", precision = 15, scale = 2)
    private BigDecimal grossTotalAnnualIncome;

  

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private VehicleLoanApplicationStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (this.id == null) {
            this.id = VehicleLoanHelper.generateVehicleLoanApplicationId();
        }
        this.createdAt = LocalDateTime.now();
        this.status = VehicleLoanApplicationStatus.DRAFT;
    }
}
