package com.taxedge.itr.filing.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.exception.ResourceNotFoundException;
import com.taxedge.gst.registration.enums.RegisterationStatus;
import com.taxedge.itr.filing.dto.ItrFilingPostDto;
import com.taxedge.itr.filing.entity.ItrFiling;
import com.taxedge.itr.filing.mapper.ItrFilingMapper;
import com.taxedge.itr.filing.repository.ItrFilingRepository;
import com.taxedge.messaging.service.EmailService;
import com.taxedge.notification.service.FcmNotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class ItrFilingServiceImpl implements ItrFilingService {

	private final ItrFilingRepository itrFilingRepository;

	private final CustomerRepository customerRepository;

	private final ItrFilingMapper itrFilingMapper;

	private final FcmNotificationService fcmNotificationService;

	private final EmailService emailService;

	@Override
	public String createItrFiling(ItrFilingPostDto dto) {

		Customer customer = customerRepository.findById(dto.getCustomerId())
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));

		ItrFiling itrFiling = itrFilingMapper.toEntity(dto);

		itrFiling.setCustomer(customer);
		itrFiling.setStatus(RegisterationStatus.DRAFT);

		String itrId = "ITR" + UUID.randomUUID().toString().replace("-", "");

		itrFiling.setItrId(itrId);

		itrFilingRepository.save(itrFiling);

		return "ITR Filing details registered successfully. ITR ID: " + itrId;
	}

	@Override
	public String updateItrFiling(String itrId, ItrFilingPostDto dto) {

		ItrFiling itrFiling = itrFilingRepository.findById(itrId)
				.orElseThrow(() -> new ResourceNotFoundException("ITR Filing details not found with ITR ID: " + itrId));

		itrFilingMapper.updateEntity(dto, itrFiling);

		itrFilingRepository.save(itrFiling);

		return "ITR Filing details updated successfully. ITR ID: " + itrFiling.getItrId();
	}

	@Override
	public ItrFiling getItrFiling(String itrId) {

		return itrFilingRepository.findById(itrId)
				.orElseThrow(() -> new ResourceNotFoundException("ITR Filing details not found with ITR ID: " + itrId));
	}

	@Override
	@Transactional
	public String submitItrFiling(String itrId, String pushToken) {

		ItrFiling itrFiling = itrFilingRepository.findById(itrId)
				.orElseThrow(() -> new ResourceNotFoundException("ITR filing not found with ID: " + itrId));

		RegisterationStatus currentStatus = itrFiling.getStatus();
		if (currentStatus != null && currentStatus != RegisterationStatus.DRAFT && currentStatus != RegisterationStatus.REJECTED) {
			throw new IllegalStateException(
					"ITR filing " + itrId + " cannot be submitted. Current status: " + currentStatus);
		}

		itrFiling.setStatus(RegisterationStatus.SUBMITTED);
		itrFiling.setSubmittedAt(LocalDateTime.now());
		itrFilingRepository.save(itrFiling);

		Customer customer = itrFiling.getCustomer();

		// Save token if new or changed (tokens rotate)
		if (pushToken != null && !pushToken.isBlank() && customer != null && !pushToken.equals(customer.getPushToken())) {
			customer.setPushToken(pushToken);
			customerRepository.save(customer);
		}

		String resolvedToken = (pushToken != null && !pushToken.isBlank())
				? pushToken
				: (customer != null ? customer.getPushToken() : null);

		String applicantName = (customer != null && customer.getName() != null && !customer.getName().isBlank())
				? customer.getName()
				: "Valued Customer";

		// Push notification
		if (resolvedToken != null && !resolvedToken.isBlank() && fcmNotificationService != null) {
			try {
				fcmNotificationService.sendRegistrationSuccessNotification(resolvedToken, applicantName);
			} catch (Exception ex) {
				log.error("Push notification failed for ITR filing id {}", itrId, ex);
			}
		}

		// Confirmation email
		try {
			if (customer != null && customer.getEmail() != null && !customer.getEmail().isBlank() && emailService != null) {
				String recipientEmail = customer.getEmail();
				String recipientName = (customer.getName() != null && !customer.getName().isBlank()) ? customer.getName() : "Valued Customer";
				emailService.sendRegistrationEmail(recipientEmail, recipientName);
			}
		} catch (Exception ex) {
			log.error("Confirmation email failed for ITR filing id {}", itrId, ex);
		}

		return "ITR filing submitted successfully. ITR ID: " + itrId;
	}
}
