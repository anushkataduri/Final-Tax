package com.taxedge.security.otp.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

/** Server-side OTP abuse limits. Override with {@code taxedge.otp.*} properties. */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "taxedge.otp")
public class OtpProperties {

    /** Wrong OTP submissions allowed before verification locks. */
    private int maxFailedAttempts = 3;

    /** How long verification (and new OTP requests) stay locked after the limit is hit. */
    private Duration lockoutDuration = Duration.ofMinutes(15);

    /** Minimum gap between two OTP sends to the same number. */
    private Duration resendCooldown = Duration.ofSeconds(30);

    /** OTP sends allowed per {@link #sendWindow} before further requests are refused. */
    private int maxSendsPerWindow = 5;

    private Duration sendWindow = Duration.ofHours(1);

    /**
     * Writes each OTP to the server log. There is no SMS gateway wired up yet, so development
     * needs this to read the code; it must stay off everywhere else.
     */
    private boolean logCode = false;
}
