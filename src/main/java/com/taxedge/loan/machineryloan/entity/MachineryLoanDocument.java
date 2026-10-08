package com.taxedge.loan.machineryloan.entity;

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
@Table(name = "machinery_loan_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
public class MachineryLoanDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machinery_loan_id", unique = true, nullable = false,
                foreignKey = @ForeignKey(name = "fk_machinery_loan_document_application"))
    private MachineryLoanApplication machineryLoanApplication;

    // -------------------------------------------------------------- banking

    @Column(name = "bank_statement_file")
    private byte[] bankStatementFile;

    // --------------------------------------------------------- business & tax

    @Column(name = "machinery_quotation_file")
    private byte[] machineryQuotationFile;

    @Column(name = "gst_certificate_file")
    private byte[] gstCertificateFile;

    @Column(name = "business_registration_proof_file")
    private byte[] businessRegistrationProofFile;

    @Column(name = "udyam_certificate_file")
    private byte[] udyamCertificateFile;

    // ------------------------------------------------------------- metadata

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
