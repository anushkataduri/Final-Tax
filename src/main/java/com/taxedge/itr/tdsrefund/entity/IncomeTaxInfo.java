package com.taxedge.itr.tdsrefund.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "itr_income_tax_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomeTaxInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                                 


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tds_refund_id",
                foreignKey = @ForeignKey(name = "fk_income_tax_refund"))
    private RefundBankAccount refundBankAccount;

    @Column(name = "salary_income")
    private BigDecimal salaryIncome;

    @Column(name = "other_income")
    private BigDecimal otherIncome;

    @Column(name = "interest_income")
    private BigDecimal interestIncome;

   

    @Column(name = "rental_income")
    private BigDecimal rentalIncome;

    @Column(name = "municipal_taxes_paid")
    private BigDecimal municipalTaxesPaid;

   

    @Column(name = "short_term_capital_gains")
    private BigDecimal shortTermCapitalGains;

    @Column(name = "long_term_capital_gains")
    private BigDecimal longTermCapitalGains;

   

    @Column(name = "gross_turnover")
    private BigDecimal grossTurnover;

    @Column(name = "net_business_profit")
    private BigDecimal netBusinessProfit;

   

    @Column(name = "home_loan_interest_sec24b")
    private BigDecimal homeLoanInterestSec24b;

   

    @Column(name = "deductions_80c", precision = 15, scale = 2)
    private BigDecimal deductions80C;

    @Column(name = "deductions_80d", precision = 15, scale = 2)
    private BigDecimal deductions80D;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
