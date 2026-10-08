package com.taxedge.gst.amendment.entity;

import com.taxedge.customer.entity.Customer;
import com.taxedge.gst.registration.enums.NatureOfPremises;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "additional_place_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalPlaceAmendmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_id", nullable = false)
    private Customer customer;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "pin_code", nullable = false)
    private String pinCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "nature_of_premises", nullable = false)
    private NatureOfPremises natureOfPremises;

    @Column(name = "image_data")
    private byte[] imageData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}