package com.taxedge.companyregistration.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "company_registered_offices")
@Getter @Setter @NoArgsConstructor
public class CompanyRegisteredOffice extends AuditedEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_registration_id", nullable = false, unique = true)
    private CompanyRegistration registration;

    @Column(name = "address_line", nullable = false) 
    private String addressLine;

    @Column(nullable = false) 
    private String city;

    private String district;

    @Column(nullable = false) private String state;

    @Column(nullable = false) 
    
    private String pincode;

    @Column(name = "premises_ownership")
     private String premisesOwnership;
    

       @Column(name = "office_address_proof_name")
        private String officeAddressProofName;

       @Column(name = "office_address_proof_uri")
       private String officeAddressProofUri;

       @Column(name = "ownership_doc_name")
       private String ownershipDocName;

       @Column(name = "ownership_doc_uri")
       private String ownershipDocUri;
 
       @Column(name = "owner_noc_name")
       private String ownerNocName;

       @Column(name = "owner_noc_uri")
       private String ownerNocUri;


}
