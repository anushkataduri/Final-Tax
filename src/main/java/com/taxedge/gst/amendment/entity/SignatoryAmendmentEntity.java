package com.taxedge.gst.amendment.entity;

import com.taxedge.customer.entity.Customer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "signatory_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignatoryAmendmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_id", nullable = false)
    private Customer customer;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "new_signatory_name", nullable = false)
    private String newSignatoryName;

    @Column(name = "new_signatory_pan", nullable = false)
    private String newSignatoryPan;

    @Column(name = "new_signatory_dob")
    private LocalDate newSignatoryDob;

    @Column(name = "new_designation")
    private String newDesignation;

    @Column(name = "new_signatory_mobile")
    private String newSignatoryMobile;

    @Column(name = "new_signatory_email")
    private String newSignatoryEmail;

    @Column(name = "image_data")
    private byte[] imageData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}