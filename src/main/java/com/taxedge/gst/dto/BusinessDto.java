package com.taxedge.gst.dto;

import java.time.LocalDate;

import com.taxedge.gst.enums.AccountType;
import com.taxedge.gst.enums.CompositionScheme;
import com.taxedge.gst.enums.ConstitutionOfBusiness;
import com.taxedge.gst.enums.NatureOfBusiness;
import com.taxedge.gst.enums.PlaceOfBusiness;
import com.taxedge.gst.enums.ReasonForRegistration;

import lombok.Data;

@Data
public class BusinessDto {

    private String businessId;

    private String legalName;

    private String tradeName;

    private ConstitutionOfBusiness constitutionOfBusiness;

    private NatureOfBusiness natureOfBusiness;

    private LocalDate dateOfCommencement;

    private ReasonForRegistration reasonForRegistration;

    private CompositionScheme compositionScheme;

    private PlaceOfBusiness placeOfBusiness;

    private String businessAddress;

    private String city;

    private String district;

    private String state;

    private String pinCode;

    private String hsnSac;

    private String accountHolderName;

    private String bankAccountNumber;

    private String ifscCode;

    private String bankName;

    private String branchName;

    private AccountType accountType;

    private String authorisedSignatory;

    private String signatoryName;

    private String signatoryPan;

    private LocalDate signatoryDob;

    private String designation;

    private String signatoryMobile;

    private String signatoryEmail;
}