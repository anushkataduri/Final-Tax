package com.taxedge.companyregistration.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ShareholdingRequest(
	@Size(max = 255) String person,
	@PositiveOrZero Long numberOfShares,
	@PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal shareValue,
	@PositiveOrZero @Max(100) @Digits(integer = 4, fraction = 3) BigDecimal percentage,
	@Positive Long id) {}