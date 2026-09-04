package com.taxedge.security.otp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.security.otp.entity.Otp;
import com.taxedge.security.otp.service.OtpService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {

	@Autowired
    private final OtpService otpService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateOtp(@RequestBody Otp otp) {
        String result = otpService.generateOtp(otp);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestBody Otp otp) {
        boolean isValid = otpService.verifyOtp(otp);

        if (isValid) {
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.status(400).body("Invalid OTP");
        }
    }
}