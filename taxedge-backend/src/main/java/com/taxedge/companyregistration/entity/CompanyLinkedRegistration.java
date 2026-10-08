package com.taxedge.companyregistration.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "company_linked_registrations")
@Getter
@Setter
@NoArgsConstructor
public class CompanyLinkedRegistration extends AuditedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "company_registration_id",
        nullable = false,
        unique = true
    )
    private CompanyRegistration registration;

    @Column(name = "pan", nullable = false)
    private boolean pan;

    @Column(name = "tan", nullable = false)
    private boolean tan;

    @Column(name = "gst", nullable = false)
    private boolean gst;

    @Column(name = "esic", nullable = false)
    private boolean esic;

    @Column(name = "epfo", nullable = false)
    private boolean epfo;

    @Column(name = "professional_tax", nullable = false)
    private boolean professionalTax;

    @Column(name = "bank_account", nullable = false)
    private boolean bankAccount;
}