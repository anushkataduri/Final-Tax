package com.taxedge.gst.amendment.service;

import com.taxedge.gst.amendment.dto.LegalNameAmendmentViewDto;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface LegalNameAmendmentService {

    LegalNameAmendmentViewDto getExistingLegalNameDetails(String gstId);

    LegalNameAmendmentViewDto submitLegalNameAmendment(String gstId, String customerId, String newLegalName, MultipartFile file) throws IOException;

    LegalNameAmendmentViewDto getAmendmentById(Long id);

    LegalNameAmendmentViewDto updateLegalNameAmendment(Long id, String newLegalName, MultipartFile file) throws IOException;
}
