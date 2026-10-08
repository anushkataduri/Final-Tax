package com.taxedge.companyregistration.dto.response;

import java.time.LocalDateTime;

public record ReceiptResponse(
	Long applicationId,
	String applicationNumber,
	String companyType,
	String status,
	LocalDateTime submittedAt,
	ReviewResponse.PaymentResponse payment) {}