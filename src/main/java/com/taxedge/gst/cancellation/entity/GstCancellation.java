package com.taxedge.gst.cancellation.entity;

import java.time.LocalDate;

import com.taxedge.customer.entity.Customer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gst_cancellation")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GstCancellation {

    @Id
    @Column(name = "cancellation_id", nullable = false, unique = true)
    private String cancellationId;

    @Column(name = "gstin", nullable = false, length = 15)
    private String gstin;

    @Column(name = "reason_for_cancellation", nullable = false)
    private String reasonForCancellation;

    @Column(name = "date_cancellation_is_sought", nullable = false)
    private LocalDate dateCancellationIsSought;

    @Column(name = "closing_stock_and_input_tax_reversal", columnDefinition = "TEXT")
    private String closingStockAndInputTaxReversal;

    @Column(name = "pending_dues_liabilities", columnDefinition = "TEXT")
    private String pendingDuesLiabilities;

    @Column(name = "last_gstr3b_filed_arn_period")
    private String lastGstr3bFiledArnPeriod;

    @Column(name = "supporting_proof_document")
    private byte[] supportingProofDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_id", nullable = false)
    private Customer customer;
}