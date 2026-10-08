package com.taxedge.companyregistration.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record CapitalRequest(
	@NotNull @Positive @Digits(integer = 17, fraction = 2) BigDecimal authorizedCapital,
	@NotNull @Positive @Digits(integer = 17, fraction = 2) BigDecimal paidUpCapital,
	@Positive Long numberOfShares,
	@Positive @Digits(integer = 17, fraction = 2) BigDecimal faceValuePerShare) {}