package com.taxedge.itr.tdsrefund.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TdsTaxesPaidDto {

	private Long id;
	private String custId;
	private String tdsRefundId;
	private BigDecimal totalTdsDeducted;
	private BigDecimal tcsAmount;
	private BigDecimal advanceTax;
	private BigDecimal selfAssessmentTax;
}
