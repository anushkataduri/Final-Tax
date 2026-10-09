package com.taxedge.customer.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

/** Server-side passcode login limits. Override with {@code taxedge.login.*} properties. */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "taxedge.login")
public class LoginProperties {

    /** Wrong passcodes allowed before the account is locked. */
    private int maxFailedAttempts = 5;

    /** How long a locked account refuses passcode logins. */
    private Duration lockoutDuration = Duration.ofMinutes(15);
}
