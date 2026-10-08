package com.taxedge.itr.tdsrefund.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Table(name = "tds_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TdsDocuments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tds_refund_id",
                foreignKey = @ForeignKey(name = "fk_tds_documents_refund"))
    private RefundBankAccount refundBankAccount;

    @Column(name = "pan_file")
    private byte[] panFile;

    @Column(name = "form16_file")
    private byte[] form16File;

    @Column(name = "form16a_file")
    private byte[] form16aFile;

    @Column(name = "ais_file")
    private byte[] aisFile;

    @Column(name = "tis_file")
    private byte[] tisFile;

    @Column(name = "bank_statements_file")
    private byte[] bankStatementsFile;

    @Column(name = "prev_itr_file")
    private byte[] prevItrFile;

    @Column(name = "tds_certs_file")
    private byte[] tdsCertsFile;

    @Column(name = "income_proofs_file")
    private byte[] incomeProofsFile;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
