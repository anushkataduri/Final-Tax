package com.taxedge.loan.homeloan.entity;

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
@Table(name = "home_loan_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
public class HomeLoanDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_loan_id", unique = true,
                foreignKey = @ForeignKey(name = "fk_home_loan_document_application"))
    private HomeLoanApplication homeLoanApplication;



    @Column(name = "pan_card_file")
    private byte[] panCardFile;

    @Column(name = "aadhaar_card_file")
    private byte[] aadhaarCardFile;

    @Column(name = "passport_photo_file")
    private byte[] passportPhotoFile;

    @Column(name = "address_proof_file")
    private byte[] addressProofFile;

    // ------------------------------------------------- income and banking

    @Column(name = "bank_statements_file")
    private byte[] bankStatementsFile;

    @Column(name = "salary_slips_file")
    private byte[] salarySlipsFile;

    @Column(name = "form16_itr_file")
    private byte[] form16ItrFile;

  

    @Column(name = "agreement_to_sell_file")
    private byte[] agreementToSellFile;

    @Column(name = "building_plan_file")
    private byte[] buildingPlanFile;

    @Column(name = "title_deed_file")
    private byte[] titleDeedFile;

    @Column(name = "encumbrance_certificate_file")
    private byte[] encumbranceCertificateFile;

    @Column(name = "down_payment_proof_file")
    private byte[] downPaymentProofFile;


    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
