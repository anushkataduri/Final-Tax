package com.taxedge.security.otp.service;

import java.util.Random;

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

    @Override
    public String generateOtp(Otp otp) {
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        otp.setOtpCode(otpCode);

        otpRepository.save(otp);

        System.out.println("OTP for " + otp.getMobileNumber() + " is: " + otpCode);

        return "OTP sent successfully";
    }

    @Override
    public boolean verifyOtp(Otp otp) {
        Otp savedOtp = otpRepository.findTopByMobileNumberOrderByIdDesc(otp.getMobileNumber());

        if (savedOtp == null) {
            return false;
        }

        return savedOtp.getOtpCode().equals(otp.getOtpCode());
    }
}