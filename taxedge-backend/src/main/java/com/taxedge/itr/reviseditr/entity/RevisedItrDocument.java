package com.taxedge.itr.reviseditr.entity;

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
@Table(name = "revised_itr_document")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevisedItrDocument {

	@Id
	@Column(name = "document_id", nullable = false, unique = true)
	private String documentId;

	@ManyToOne
	@JoinColumn(name = "revised_itr_id", nullable = false)
	private RevisedItr revisedItr;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "pan_card", columnDefinition = "LONGBLOB")
	private byte[] panCard;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "aadhaar_card", columnDefinition = "LONGBLOB")
	private byte[] aadhaarCard;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "form_16_form_16a", columnDefinition = "LONGBLOB")
	private byte[] form16Form16A;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "ais_tis_statement", columnDefinition = "LONGBLOB")
	private byte[] aisTisStatement;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "bank_statements", columnDefinition = "LONGBLOB")
	private byte[] bankStatements;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "investment_proofs", columnDefinition = "LONGBLOB")
	private byte[] investmentProofs;
}