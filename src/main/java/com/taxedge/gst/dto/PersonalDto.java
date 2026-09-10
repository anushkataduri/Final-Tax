package com.taxedge.gst.dto;

import java.time.LocalDate;

import com.taxedge.gst.enums.CompositionScheme;
import com.taxedge.gst.enums.ConstitutionOfBusiness;
import com.taxedge.gst.enums.ReasonForRegistration;

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