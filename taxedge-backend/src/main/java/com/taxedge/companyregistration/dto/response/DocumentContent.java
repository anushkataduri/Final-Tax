package com.taxedge.companyregistration.dto.response;

import org.springframework.core.io.Resource;

public record DocumentContent(Resource resource, String fileName, String mimeType) {}
