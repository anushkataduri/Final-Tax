//package com.taxedge.gst.entity;
//
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.List;
//
//import com.taxedge.gst.enums.CompositionScheme;
//import com.taxedge.gst.enums.ConstitutionOfBusiness;
//import com.taxedge.gst.enums.ReasonForRegistration;
//
//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.OneToMany;
//import jakarta.persistence.OneToOne;
//import jakarta.persistence.Table;
//import lombok.Data;
//@Data
//@Entity
//@Table(name = "personal_details")
//public class Personal {
//	 @Id
//	 @Column(name = "gst_id", length = 9, unique = true, nullable = false)
//	 private String gstId;
//
//	 @Column(name = "legal_name", nullable = false, length = 100)
//	 private String legalName;
//	 
//	 @Column(name = "trade_name", nullable = false, length = 100)
//	 private String tradeName;
//
//	 @Enumerated(EnumType.STRING)
//	 @Column(name = "constitution_of_business", nullable = false)
//	 private ConstitutionOfBusiness constitutionOfBusiness;
//
//	 @Column(name = "state", nullable = false, length = 50)
//	 private String state;
//
//	 @Column(name = "district", nullable = false, length = 50)
//	 private String district;
//
//	 @Enumerated(EnumType.STRING)
//	 @Column(name = "reason_for_registration", nullable = false)
//	 private ReasonForRegistration reasonForRegistration;
//
//	 @Enumerated(EnumType.STRING)
//	 @Column(name = "composition_scheme", nullable = false)
//	 private CompositionScheme compositionScheme;
//    
//	 @Column(name = "date_of_commencement", nullable = false)
//	 private LocalDate dateOfCommencement;
//    
//	// @OneToMany(mappedBy = "personal",cascade = CascadeType.ALL,orphanRemoval = true)
//   //  private List<Documents> documents = new ArrayList<>();
//}