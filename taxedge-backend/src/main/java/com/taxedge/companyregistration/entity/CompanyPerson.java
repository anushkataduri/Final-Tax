package com.taxedge.companyregistration.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "company_persons",
    indexes = @Index(
        name = "idx_company_person_registration",
        columnList = "company_registration_id"
    )
)
@Getter
@Setter
@NoArgsConstructor
public class CompanyPerson extends AuditedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_registration_id", nullable = false)
    private CompanyRegistration registration;

    @Column(name = "person_type", nullable = false)
    private String personType;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "pan", nullable = false)
    private String pan;

    @Column(name = "aadhaar")
    private String aadhaar;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "father_name")
    private String fatherName;

    @Column(name = "gender")
    private String gender;

    @Column(name = "nationality")
    private String nationality;

    @Column(name = "place_of_birth")
    private String placeOfBirth;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "educational_qualification")
    private String educationalQualification;

    @Column(name = "designation")
    private String designation;

    @Column(name = "category")
    private String category;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "has_din")
    private Boolean hasDin;

    @Column(name = "din")
    private String din;

    @Column(name = "has_dsc")
    private Boolean hasDsc;

    @Column(name = "shares_percentage")
    private BigDecimal sharesPercentage;

    @Column(name = "residential_address")
    private String residentialAddress;

    @Column(name = "is_resident_in_india")
    private Boolean isResidentInIndia;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "state")
    private String state;

    @Column(name = "pin_code")
    private String pinCode;

    @Column(name = "same_as_permanent_address")
    private Boolean sameAsPermanentAddress;

    @Column(name = "present_address_line1")
    private String presentAddressLine1;

    @Column(name = "present_address_line2")
    private String presentAddressLine2;

    @Column(name = "present_city")
    private String presentCity;

    @Column(name = "present_district")
    private String presentDistrict;

    @Column(name = "present_state")
    private String presentState;

    @Column(name = "present_pincode")
    private String presentPincode;

    @Column(name = "number_of_shares")
    private Long numberOfShares;

    @Column(name = "amount_subscribed")
    private BigDecimal amountSubscribed;

    @Column(name = "contribution_amount")
    private BigDecimal contributionAmount;

    @Column(name = "profit_share_percentage")
    private BigDecimal profitSharePercentage;

    @Column(name = "capital_contribution")
    private BigDecimal capitalContribution;

    @Column(name = "profit_sharing_ratio")
    private BigDecimal profitSharingRatio;

    @Column(name = "relationship")
    private String relationship;

    @Column(name = "identity_proof_doc_name")
    private String identityProofDocName;

    @Column(name = "residential_address_proof_doc_name")
    private String residentialAddressProofDocName;
}