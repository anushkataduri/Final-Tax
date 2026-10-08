package com.taxedge.itr.tdsrefund.entity;

import java.time.LocalDateTime;

import jakarta.persistence.EnumType;
import com.taxedge.itr.tdsrefund.enums.AccountType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tds_refund_bank_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundBankAccount {

	@Id
	@Column(name = "tds_refund_id", nullable = false, updatable = false, length = 20)
	private String id;

    @Column(name = "cust_id", nullable = false, length = 50)
    private String custId;

    @Column(name = "account_holder_name", nullable = false, length = 100)
    private String accountHolderName;

    @Column(name = "account_number", nullable = false, length = 18)
    private String accountNumber;

    @Column(name = "ifsc_code", nullable = false, length = 11)
    private String ifscCode;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "branch_name", length = 100)
    private String branchName;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 10)
    private AccountType accountType;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
