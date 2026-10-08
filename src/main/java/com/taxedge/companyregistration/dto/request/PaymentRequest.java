package com.taxedge.companyregistration.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record PaymentRequest(
	@NotNull @PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal amount,
	@PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal governmentFee,
	@PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal professionalFee,
	@PositiveOrZero @Digits(integer = 17, fraction = 2) BigDecimal totalAmount,
	@Size(max = 255) String paymentStatus,
	@Size(max = 255) String transactionId,
	@Size(max = 255) String paymentGateway,
	@Size(max = 255) String paymentMethod) {}