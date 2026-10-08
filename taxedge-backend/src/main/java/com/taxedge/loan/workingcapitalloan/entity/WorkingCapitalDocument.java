package com.taxedge.loan.workingcapitalloan.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "working_capital_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
public class WorkingCapitalDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "working_capital_id", unique = true, nullable = false,
                foreignKey = @ForeignKey(name = "fk_working_capital_document_application"))
    private WorkingCapitalApplication workingCapitalApplication;


    @Column(name = "pan_card_file")
    private byte[] panCardFile;

    @Column(name = "aadhaar_card_file")
    private byte[] aadhaarCardFile;

    @Column(name = "kyc_directors_file")
    private byte[] kycDirectorsFile;



    @Column(name = "bank_statement_file")
    private byte[] bankStatementFile;



    @Column(name = "gst_certificate_file")
    private byte[] gstCertificateFile;

    @Column(name = "gst_returns_file")
    private byte[] gstReturnsFile;

    @Column(name = "business_itr_file")
    private byte[] businessItrFile;

    @Column(name = "audited_balance_sheet_file")
    private byte[] auditedBalanceSheetFile;

    @Column(name = "profit_loss_statement_file")
    private byte[] profitLossStatementFile;

    @Column(name = "udyam_certificate_file")
    private byte[] udyamCertificateFile;

    @Column(name = "business_registration_proof_file")
    private byte[] businessRegistrationProofFile;

   

    @Column(name = "existing_loan_sanction_letter_file")
    private byte[] existingLoanSanctionLetterFile;



    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
