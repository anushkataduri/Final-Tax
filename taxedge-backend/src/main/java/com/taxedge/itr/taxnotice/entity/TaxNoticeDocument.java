package com.taxedge.itr.taxnotice.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "tax_notice", columnDefinition = "LONGBLOB")
	private byte[] taxNotice;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "previous_itr", columnDefinition = "LONGBLOB")
	private byte[] previousItr;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "itr_acknowledgement", columnDefinition = "LONGBLOB")
	private byte[] itrAcknowledgement;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "form_16_16a", columnDefinition = "LONGBLOB")
	private byte[] form1616a;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "ais_ay", columnDefinition = "LONGBLOB")
	private byte[] aisAy;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "tis", columnDefinition = "LONGBLOB")
	private byte[] tis;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "bank_statement", columnDefinition = "LONGBLOB")
	private byte[] bankStatement;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "supporting_income_documents", columnDefinition = "LONGBLOB")
	private byte[] supportingIncomeDocuments;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "supporting_expense_documents", columnDefinition = "LONGBLOB")
	private byte[] supportingExpenseDocuments;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "previous_tax_responses", columnDefinition = "LONGBLOB")
	private byte[] previousTaxResponses;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "other_notice_specific_documents", columnDefinition = "LONGBLOB")
	private byte[] otherNoticeSpecificDocuments;

	@Column(name = "message")
	private String message;
}