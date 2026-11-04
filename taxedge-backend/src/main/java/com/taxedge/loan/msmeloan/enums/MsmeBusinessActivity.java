package com.taxedge.loan.msmeloan.enums;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public enum MsmeBusinessActivity {
    MANUFACTURING("Manufacturing"),
    SERVICE("Service"),
    TRADING("Trading");

    private final String displayName;

    MsmeBusinessActivity(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    private static final Set<String> NAMES = Arrays.stream(values())
            .map(Enum::name)
            .collect(Collectors.toUnmodifiableSet());

    public static boolean contains(String name) {
        return name != null && NAMES.contains(name.trim().toUpperCase());
    }
}
