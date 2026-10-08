package com.taxedge.loan.homeloan.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.taxedge.customer.entity.Customer;
import com.taxedge.loan.homeloan.enums.EmploymentProfile;
import com.taxedge.loan.homeloan.enums.ExistingLoanStatus;
import com.taxedge.loan.homeloan.enums.HomeLoanApplicationStatus;
import com.taxedge.loan.homeloan.enums.ItrFilingStatus;
import com.taxedge.loan.homeloan.enums.MonthlyIncomeRange;
import com.taxedge.loan.homeloan.enums.PropertyConstructionStage;
import com.taxedge.loan.homeloan.enums.PropertyIntent;
import com.taxedge.loan.homeloan.helper.HomeLoanHelper;

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
@Table(name = "home_loan_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeLoanApplication {

    @Id
    @Column(name = "home_loan_id", nullable = false, updatable = false, length = 20)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_id",
                foreignKey = @ForeignKey(name = "fk_home_loan_customer"))
    private Customer customer;


    @Column(name = "loan_amount")
    private BigDecimal loanAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_intent", length = 40)
    private PropertyIntent propertyIntent;

    @Column(name = "tenure_months")
    private Integer tenureMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "construction_stage", length = 30)
    private PropertyConstructionStage constructionStage;

    @Column(name = "property_cost")
    private BigDecimal propertyCost;

 

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_profile", length = 30)
    private EmploymentProfile employmentProfile;

    @Enumerated(EnumType.STRING)
    @Column(name = "monthly_income_range", length = 30)
    private MonthlyIncomeRange monthlyIncomeRange;

    @Enumerated(EnumType.STRING)
    @Column(name = "existing_loan_status", length = 20)
    private ExistingLoanStatus existingLoanStatus;

    @Column(name = "ongoing_monthly_emi", precision = 15, scale = 2)
    private BigDecimal ongoingMonthlyEmi;



    @Column(name = "bank_name", length = 150)
    private String bankName;

    @Column(name = "bank_account_number", length = 20)
    private String bankAccountNumber;

    @Column(name = "ifsc_code", length = 11)
    private String ifscCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "itr_filing_status", length = 20)
    private ItrFilingStatus itrFilingStatus;

    @Column(name = "itr_acknowledgement_number", length = 15)
    private String itrAcknowledgementNumber;

    @Column(name = "gross_total_income")
    private BigDecimal grossTotalIncome;


    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private HomeLoanApplicationStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (this.id == null) {
            this.id = HomeLoanHelper.generateHomeLoanApplicationId();
        }
        this.createdAt = LocalDateTime.now();
        this.status = HomeLoanApplicationStatus.DRAFT;
    }
}
