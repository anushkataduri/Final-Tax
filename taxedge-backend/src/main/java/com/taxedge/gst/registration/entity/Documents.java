package com.taxedge.gst.registration.entity;

import com.taxedge.gst.registration.enums.PrincipalPlaceAddressType;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "gst_reg_documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Documents {

	@Id
	@Column(name = "document_id", nullable = false, unique = true, length = 35)
	private String documentId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gst_id", nullable = false, unique = true)
	private Business business;

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
	@Column(name = "business_registration_proof", columnDefinition = "LONGBLOB")
	private byte[] businessRegistrationProof;

	@Enumerated(EnumType.STRING)
	@Column(name = "principal_place_address_type", length = 50)
	private PrincipalPlaceAddressType principalPlaceAddressType;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "principal_place_address_proof", columnDefinition = "LONGBLOB")
	private byte[] principalPlaceAddressProof;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "bank_passbook_or_cancelled_cheque", columnDefinition = "LONGBLOB")
	private byte[] bankPassbookOrCancelledCheque;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "passport_size_photograph", columnDefinition = "LONGBLOB")
	private byte[] passportSizePhotograph;
}