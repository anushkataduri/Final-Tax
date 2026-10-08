package com.taxedge.itr.taxnotice.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxNoticeDocumentDto {

	private String noticeId;

	private byte[] taxNotice;

	private byte[] previousItr;

	private byte[] itrAcknowledgement;

	private byte[] form1616a;

	private byte[] aisAy;

	private byte[] tis;

	private byte[] bankStatement;

	private byte[] supportingIncomeDocuments;

	private byte[] supportingExpenseDocuments;

	private byte[] previousTaxResponses;

	private byte[] otherNoticeSpecificDocuments;

	@Size(max = 1000, message = "Message cannot exceed 1000 characters")
	private String message;
}