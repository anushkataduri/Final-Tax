package com.taxedge.loan.workingcapitalloan.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.taxedge.customer.entity.Customer;
import com.taxedge.loan.workingcapitalloan.enums.BusinessVintage;
import com.taxedge.loan.workingcapitalloan.enums.CreditPurpose;
import com.taxedge.loan.workingcapitalloan.enums.ExistingLoanStatus;
import com.taxedge.loan.workingcapitalloan.enums.FacilityType;
import com.taxedge.loan.workingcapitalloan.enums.ItrFilingStatus;
import com.taxedge.loan.workingcapitalloan.enums.WorkingCapitalApplicationStatus;
import com.taxedge.loan.workingcapitalloan.helper.WorkingCapitalHelper;

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
@Table(name = "working_capital_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingCapitalApplication {

    @Id
    @Column(name = "working_capital_id", nullable = false, updatable = false, length = 20)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_id",
                foreignKey = @ForeignKey(name = "fk_working_capital_customer"))
    private Customer customer;



    @Column(name = "credit_limit")
    private BigDecimal creditLimit;

    @Enumerated(EnumType.STRING)
    @Column(name = "credit_purpose", length = 40)
    private CreditPurpose creditPurpose;

    @Enumerated(EnumType.STRING)
    @Column(name = "facility_type", length = 30)
    private FacilityType facilityType;

    @Enumerated(EnumType.STRING)
    @Column(name = "existing_borrowing_status", length = 20)
    private ExistingLoanStatus existingBorrowingStatus;

    @Column(name = "monthly_interest_outgo")
    private BigDecimal monthlyInterestOutgo;



    @Column(name = "business_name", length = 200)
    private String businessName;

    @Column(name = "gstin", length = 15)
    private String gstin;

    @Column(name = "udyam_registration_number", length = 30)
    private String udyamRegistrationNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "operational_track_record", length = 30)
    private BusinessVintage operationalTrackRecord;

    @Column(name = "annual_audited_turnover")
    private BigDecimal annualAuditedTurnover;

    @Column(name = "annual_net_profit_before_tax")
    private BigDecimal annualNetProfitBeforeTax;

    @Column(name = "bank_name", length = 150)
    private String bankName;

    @Column(name = "current_account_number", length = 20)
    private String currentAccountNumber;

    @Column(name = "ifsc_code", length = 11)
    private String ifscCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "itr_filing_status", length = 20)
    private ItrFilingStatus itrFilingStatus;

    @Column(name = "itr_acknowledgement_number", length = 15)
    private String itrAcknowledgementNumber;



    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private WorkingCapitalApplicationStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (this.id == null) {
            this.id = WorkingCapitalHelper.generateWorkingCapitalApplicationId();
        }
        this.createdAt = LocalDateTime.now();
        this.status = WorkingCapitalApplicationStatus.DRAFT;
    }
}
