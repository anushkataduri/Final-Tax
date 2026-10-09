package com.taxedge.itr.filing.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "itr_document")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItrDocument {

    @Id
    @Column(name = "document_id", nullable = false, unique = true)
    private String documentId;

    @OneToOne
    @JoinColumn(name = "itr_id", nullable = false)
    private ItrFiling itrFiling;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "form_16_part_a_part_b", columnDefinition = "LONGBLOB")
    private byte[] form16PartAPartB;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "form_26as", columnDefinition = "LONGBLOB")
    private byte[] form26as;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "ais_tis", columnDefinition = "LONGBLOB")
    private byte[] aisTis;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "bank_account_statement", columnDefinition = "LONGBLOB")
    private byte[] bankAccountStatement;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "salary_payslips", columnDefinition = "LONGBLOB")
    private byte[] salaryPayslips;
}