package com.taxedge.itr.taxnotice.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tax_notice_document")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxNoticeDocument {

	@Id
	@Column(name = "document_id", nullable = false, unique = true)
	private String documentId;

	@OneToOne
	@JoinColumn(name = "notice_id", nullable = false)
	private TaxNoticeAssistance taxNoticeAssistance;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "tax_notice", columnDefinition = "bytea")
	private byte[] taxNotice;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "previous_itr", columnDefinition = "bytea")
	private byte[] previousItr;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "itr_acknowledgement", columnDefinition = "bytea")
	private byte[] itrAcknowledgement;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "form_16_16a", columnDefinition = "bytea")
	private byte[] form1616a;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "ais_ay", columnDefinition = "bytea")
	private byte[] aisAy;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "tis", columnDefinition = "bytea")
	private byte[] tis;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "bank_statement", columnDefinition = "bytea")
	private byte[] bankStatement;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "supporting_income_documents", columnDefinition = "bytea")
	private byte[] supportingIncomeDocuments;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "supporting_expense_documents", columnDefinition = "bytea")
	private byte[] supportingExpenseDocuments;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "previous_tax_responses", columnDefinition = "bytea")
	private byte[] previousTaxResponses;

	@Basic(fetch = FetchType.LAZY)
	@Column(name = "other_notice_specific_documents", columnDefinition = "bytea")
	private byte[] otherNoticeSpecificDocuments;

	@Column(name = "message")
	private String message;
}