package com.taxedge.gst.registration.dto;

import java.time.LocalDate;

import com.taxedge.gst.registration.enums.CompositionScheme;
import com.taxedge.gst.registration.enums.ConstitutionOfBusiness;
import com.taxedge.gst.registration.enums.ReasonForRegistration;

import lombok.Data;

@Data
public class PersonalDto {

	private String gstId;
    private String legalName;
    private String tradeName;
    private ConstitutionOfBusiness constitutionOfBusiness;
    private String state;
    private String district;
    private ReasonForRegistration reasonForRegistration;
    private CompositionScheme compositionScheme;
    private LocalDate dateOfCommencement;
}