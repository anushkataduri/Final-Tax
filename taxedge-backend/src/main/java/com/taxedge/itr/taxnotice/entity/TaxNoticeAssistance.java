package com.taxedge.itr.taxnotice.entity;

import java.time.LocalDate;

import com.taxedge.customer.entity.Customer;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tax_notice_assistance")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxNoticeAssistance {

	@Id
	@Column(name = "notice_id", nullable = false, unique = true)
	private String noticeId;

	@ManyToOne
	@JoinColumn(name = "cust_id", nullable = false)
	private Customer customer;

	@Column(name = "permanent_account_number", nullable = false)
	private String permanentAccountNumber;

	@Column(name = "assessment_year", nullable = false)
	private String assessmentYear;

	@Column(name = "notice_type_section", nullable = false)
	private String noticeTypeSection;

	@Column(name = "notice_date", nullable = false)
	private LocalDate noticeDate;

	@Column(name = "notice_reference_number_din", nullable = false)
	private String noticeReferenceNumberDin;

	@Column(name = "response_due_date", nullable = false)
	private LocalDate responseDueDate;

	@Column(name = "message")
	private String message;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "notice_document", columnDefinition = "LONGBLOB")
	private byte[] noticeDocument;
}