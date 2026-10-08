package com.taxedge.gst.amendment.service;

import com.taxedge.gst.amendment.dto.BankAccountAmendmentViewDto;
import com.taxedge.gst.registration.enums.AccountType;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface BankAccountAmendmentService {

    BankAccountAmendmentViewDto getExistingBankAccountDetails(String gstId);

    BankAccountAmendmentViewDto submitBankAccountAmendment(String gstId, String customerId, String bankName, String accountNumber,
                                                           String ifscCode, AccountType accountType, MultipartFile file) throws IOException;

    BankAccountAmendmentViewDto getAmendmentById(Long id);

    BankAccountAmendmentViewDto updateBankAccountAmendment(Long id, String bankName, String accountNumber,
                                                           String ifscCode, AccountType accountType, MultipartFile file) throws IOException;
}
