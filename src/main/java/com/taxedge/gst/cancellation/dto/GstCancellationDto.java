package com.taxedge.gst.cancellation.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GstCancellationDto {

    private String customerId;

    private String gstin;

    private String reasonForCancellation;

    private LocalDate dateCancellationIsSought;

    private String closingStockAndInputTaxReversal;

    private String pendingDuesLiabilities;

    private String lastGstr3bFiledArnPeriod;

    private byte[] supportingProofDocument;
}