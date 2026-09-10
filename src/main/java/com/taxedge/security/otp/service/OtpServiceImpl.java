package com.taxedge.security.otp.service;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.security.otp.entity.Otp;
import com.taxedge.security.otp.repository.OtpRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

	@Autowired
    private final OtpRepository otpRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public String generateOtp(Otp otp) {
        int code = 100000 + secureRandom.nextInt(900000);
        String otpCode = String.valueOf(code);
        otp.setOtpCode(otpCode);

        otpRepository.save(otp);

        System.out.println("OTP for " + otp.getMobileNumber() + " is: " + otpCode);

        return "OTP sent successfully";
    }

    @Override
    public boolean verifyOtp(Otp otp) {
        if (otp.getMobileNumber() == null || otp.getOtpCode() == null) {
            throw new IllegalArgumentException("Mobile number and OTP code must be provided");
        }

        Otp savedOtp = otpRepository.findTopByMobileNumberOrderByIdDesc(otp.getMobileNumber());

        if (savedOtp == null) {
            throw new RuntimeException("OTP not found");
        }

        if (!savedOtp.getOtpCode().equals(otp.getOtpCode())) {
            throw new RuntimeException("Invalid OTP");
        }

        return true;
    }
}