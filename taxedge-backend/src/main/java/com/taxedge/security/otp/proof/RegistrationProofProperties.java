package com.taxedge.security.otp.proof;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

/** Override with {@code taxedge.registration-proof.*}. */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "taxedge.registration-proof")
public class RegistrationProofProperties {

    /** How long after OTP verification the number may complete registration. Keep in step with the app's resume window. */
    private Duration ttl = Duration.ofMinutes(30);
}
