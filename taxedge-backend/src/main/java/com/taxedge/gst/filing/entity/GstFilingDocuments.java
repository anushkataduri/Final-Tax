package com.taxedge.gst.filing.entity;

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
@Table(name = "gst_filing_documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GstFilingDocuments {

	@Id
	@Column(name = "document_id", nullable = false, unique = true)
	private String documentId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "filing_id", nullable = false, unique = true)
	private GstFiling gstFiling;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "sales_invoice", columnDefinition = "LONGBLOB")
	private byte[] salesInvoice;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "purchase_invoices", columnDefinition = "LONGBLOB")
	private byte[] purchaseInvoices;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "gstr2b_itc_statement", columnDefinition = "LONGBLOB")
	private byte[] gstr2bItcStatement;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "credit_notes", columnDefinition = "LONGBLOB")
	private byte[] creditNotes;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "debit_notes", columnDefinition = "LONGBLOB")
	private byte[] debitNotes;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "e_invoice_data", columnDefinition = "LONGBLOB")
	private byte[] eInvoiceData;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "e_way_bill_data", columnDefinition = "LONGBLOB")
	private byte[] eWayBillData;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "expense_invoices_and_vouchers", columnDefinition = "LONGBLOB")
	private byte[] expenseInvoicesAndVouchers;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "bank_statement", columnDefinition = "LONGBLOB")
	private byte[] bankStatement;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "previous_gst_returns", columnDefinition = "LONGBLOB")
	private byte[] previousGstReturns;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "previous_filing_acknowledgement", columnDefinition = "LONGBLOB")
	private byte[] previousFilingAcknowledgement;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "other_supporting_documents", columnDefinition = "LONGBLOB")
	private byte[] otherSupportingDocuments;
}