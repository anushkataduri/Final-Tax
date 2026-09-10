package com.taxedge.security.otp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.security.otp.entity.Otp;
import com.taxedge.security.otp.service.OtpService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {

	@Autowired
    private final OtpService otpService;

	@Autowired
    private final CustomerRepository customerRepository;

    @PostMapping("/generate")
    public ResponseEntity<String> generateOtp(@RequestBody Otp otp) {
        String result = otpService.generateOtp(otp);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Otp otp) {
        boolean isValid = otpService.verifyOtp(otp);

        if (isValid) {
            boolean isExisting = customerRepository.findByMobileNumber(otp.getMobileNumber()).isPresent();
            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "isExistingUser", isExisting,
                "message", "OTP verified successfully"
            ));
        } else {
            return ResponseEntity.status(400).body(java.util.Map.of(
                "success", false,
                "message", "Invalid OTP"
            ));
        }
    }
}