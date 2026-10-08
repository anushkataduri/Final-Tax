package com.taxedge.gst.amendment.entity;

import com.taxedge.customer.entity.Customer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "legal_name_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalNameAmendmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_id", nullable = false)
    private Customer customer;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "new_legal_name", nullable = false)
    private String newLegalName;

    @Column(name = "image_data")
    private byte[] imageData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}