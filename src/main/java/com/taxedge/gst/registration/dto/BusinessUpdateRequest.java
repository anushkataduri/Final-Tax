package com.taxedge.gst.registration.dto;

import java.time.LocalDate;

import com.taxedge.gst.registration.enums.AccountType;
import com.taxedge.gst.registration.enums.CompositionScheme;
import com.taxedge.gst.registration.enums.ConstitutionOfBusiness;
import com.taxedge.gst.registration.enums.NatureOfBusiness;
import com.taxedge.gst.registration.enums.PlaceOfBusiness;
import com.taxedge.gst.registration.enums.ReasonForRegistration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessUpdateRequest {

    @NotBlank
    @Size(max = 100)
    private String legalName;

    @NotBlank
    @Size(max = 100)
    private String tradeName;

    @NotNull
    private ConstitutionOfBusiness constitutionOfBusiness;

    @NotNull
    private NatureOfBusiness natureOfBusiness;

    @NotNull
    @PastOrPresent
    private LocalDate dateOfCommencement;

    @NotNull
    private ReasonForRegistration reasonForRegistration;

    @NotNull
    private CompositionScheme compositionScheme;

    @NotNull
    private PlaceOfBusiness placeOfBusiness;

    @NotBlank
    @Size(max = 255)
    private String businessAddress;

    @NotBlank
    @Size(max = 50)
    private String city;

    @NotBlank
    @Size(max = 50)
    private String district;

    @NotBlank
    @Size(max = 50)
    private String state;

    @NotBlank
    @Pattern(regexp = "\\d{6}")
    private String pinCode;

    @NotBlank
    @Pattern(regexp = "\\d{8}")
    private String hsnSac;

    @NotBlank
    @Size(max = 100)
    private String accountHolderName;

    @NotBlank
    @Pattern(regexp = "\\d{9,18}")
    private String bankAccountNumber;

    @NotBlank
    @Pattern(
            regexp = "^[A-Z]{4}0[A-Z0-9]{6}$",
            message = "Invalid IFSC code")
    private String ifscCode;

    @NotBlank
    @Size(max = 100)
    private String bankName;

    @NotBlank
    @Size(max = 100)
    private String branchName;

    @NotNull
    private AccountType accountType;

    @NotBlank
    @Pattern(regexp = "[A-Za-z ]{1,10}")
    private String authorisedSignatory;

    @NotBlank
    @Size(max = 100)
    private String signatoryName;

    @NotBlank
    @Pattern(
            regexp = "[A-Z]{5}[0-9]{4}[A-Z]",
            message = "Invalid PAN format")
    private String signatoryPan;

    @NotNull
    @PastOrPresent
    private LocalDate signatoryDob;

    @NotBlank
    @Size(max = 50)
    private String designation;

    @NotBlank
    @Pattern(regexp = "\\d{10}")
    private String signatoryMobile;

    @NotBlank
    @Email
    @Size(max = 150)
    private String signatoryEmail;
}