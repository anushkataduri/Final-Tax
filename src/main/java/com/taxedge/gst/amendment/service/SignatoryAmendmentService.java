package com.taxedge.gst.amendment.service;

import com.taxedge.gst.amendment.dto.SignatoryAmendmentViewDto;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;

public interface SignatoryAmendmentService {

    SignatoryAmendmentViewDto getExistingSignatoryDetails(String gstId);

    SignatoryAmendmentViewDto submitSignatoryAmendment(String gstId, String customerId, String signatoryName, String signatoryPan,
                                                       LocalDate signatoryDob, String designation, String signatoryMobile,
                                                       String signatoryEmail, MultipartFile file) throws IOException;

    SignatoryAmendmentViewDto getAmendmentById(Long id);

    SignatoryAmendmentViewDto updateSignatoryAmendment(Long id, String signatoryName, String signatoryPan,
                                                       LocalDate signatoryDob, String designation, String signatoryMobile,
                                                       String signatoryEmail, MultipartFile file) throws IOException;
}
