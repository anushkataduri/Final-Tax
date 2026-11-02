package com.taxedge.loan.personalloan.service;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.exception.ResourceNotFoundException;
import com.taxedge.loan.personalloan.dto.PersonalLoanDocumentDto;
import com.taxedge.loan.personalloan.entity.PersonalLoanApplication;
import com.taxedge.loan.personalloan.entity.PersonalLoanDocument;
import com.taxedge.loan.personalloan.mapper.PersonalLoanDocumentMapper;
import com.taxedge.loan.personalloan.repository.PersonalLoanApplicationRepository;
import com.taxedge.loan.personalloan.repository.PersonalLoanDocumentRepository;
import com.taxedge.security.jwt.JwtPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PersonalLoanDocumentServiceImpl implements PersonalLoanDocumentService {

    private final PersonalLoanDocumentRepository repository;
    private final PersonalLoanApplicationRepository applicationRepository;
    private final PersonalLoanDocumentMapper mapper;

    @Override
    @Transactional
    public String saveDocuments(String loanApplicationId,
                                MultipartFile panCardFile,
                                MultipartFile aadhaarCardFile,
                                MultipartFile addressProofFile,
                                MultipartFile photographFile,
                                MultipartFile bankStatementsFile,
                                MultipartFile salarySlipsFile,
                                MultipartFile itrAcknowledgmentFile) {
        try {
            PersonalLoanApplication application = findApplicationForCurrentCustomer(loanApplicationId);
            PersonalLoanDocument entity = repository.findByLoanApplication_Id(loanApplicationId)
                    .orElseGet(() -> PersonalLoanDocument.builder()
                            .loanApplication(application)
                            .build());

            setIfUploaded(panCardFile, entity::setPanCardFile);
            setIfUploaded(aadhaarCardFile, entity::setAadhaarCardFile);
            setIfUploaded(addressProofFile, entity::setAddressProofFile);
            setIfUploaded(photographFile, entity::setPhotographFile);
            setIfUploaded(bankStatementsFile, entity::setBankStatementsFile);
            setIfUploaded(salarySlipsFile, entity::setSalarySlipsFile);
            setIfUploaded(itrAcknowledgmentFile, entity::setItrAcknowledgmentFile);

            if (hasUploadedFile(panCardFile, aadhaarCardFile, addressProofFile,
                    photographFile, bankStatementsFile, salarySlipsFile,
                    itrAcknowledgmentFile)) {
                repository.save(entity);
            }
            log.info("Documents saved for personal loan application {}", loanApplicationId);
            return loanApplicationId;

        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded files: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public String updateDocuments(String loanApplicationId,
                                  MultipartFile panCardFile,
                                  MultipartFile aadhaarCardFile,
                                  MultipartFile addressProofFile,
                                  MultipartFile photographFile,
                                  MultipartFile bankStatementsFile,
                                  MultipartFile salarySlipsFile,
                                  MultipartFile itrAcknowledgmentFile) {
        try {
            PersonalLoanDocument entity = findOrThrow(loanApplicationId);

            if (panCardFile != null && !panCardFile.isEmpty())
                entity.setPanCardFile(panCardFile.getBytes());
            if (aadhaarCardFile != null && !aadhaarCardFile.isEmpty())
                entity.setAadhaarCardFile(aadhaarCardFile.getBytes());
            if (addressProofFile != null && !addressProofFile.isEmpty())
                entity.setAddressProofFile(addressProofFile.getBytes());
            if (photographFile != null && !photographFile.isEmpty())
                entity.setPhotographFile(photographFile.getBytes());
            if (bankStatementsFile != null && !bankStatementsFile.isEmpty())
                entity.setBankStatementsFile(bankStatementsFile.getBytes());
            if (salarySlipsFile != null && !salarySlipsFile.isEmpty())
                entity.setSalarySlipsFile(salarySlipsFile.getBytes());
            if (itrAcknowledgmentFile != null && !itrAcknowledgmentFile.isEmpty())
                entity.setItrAcknowledgmentFile(itrAcknowledgmentFile.getBytes());

            log.info("Documents updated for personal loan application {}", loanApplicationId);
            return loanApplicationId;

        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded files: " + e.getMessage(), e);
        }
    }

    @Override
    public PersonalLoanDocumentDto getDocuments(String loanApplicationId) {
        return mapper.toDto(findOrThrow(loanApplicationId));
    }

    @Override
    public byte[] downloadFile(String loanApplicationId, String fileType) {
        PersonalLoanDocument entity = findOrThrow(loanApplicationId);
        return switch (fileType.toLowerCase()) {
            case "pancardfile"        -> entity.getPanCardFile();
            case "aadhaarcard"        -> entity.getAadhaarCardFile();
            case "addressproof"       -> entity.getAddressProofFile();
            case "photograph"         -> entity.getPhotographFile();
            case "bankstatements"     -> entity.getBankStatementsFile();
            case "salaryslips"        -> entity.getSalarySlipsFile();
            case "itracknowledgment"  -> entity.getItrAcknowledgmentFile();
            default -> throw new ResourceNotFoundException("Unknown file type: " + fileType);
        };
    }

    private PersonalLoanDocument findOrThrow(String loanApplicationId) {
        findApplicationForCurrentCustomer(loanApplicationId);
        return repository.findByLoanApplication_Id(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Documents not found for personal loan application: " + loanApplicationId));
    }

    private PersonalLoanApplication findApplicationForCurrentCustomer(String loanApplicationId) {
        return applicationRepository
                .findByIdAndCustomer_CustId(loanApplicationId, currentCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Loan application not found: " + loanApplicationId));
    }

    private String currentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)
                || !StringUtils.hasText(principal.custId())
                || !authentication.getAuthorities().stream()
                        .anyMatch(authority -> "ROLE_CUSTOMER".equals(authority.getAuthority()))) {
            throw new AccessDeniedException("An authenticated customer is required");
        }
        return principal.custId();
    }

    private void setIfUploaded(MultipartFile file, FileSetter setter) throws IOException {
        if (file != null && !file.isEmpty()) {
            setter.set(file.getBytes());
        }
    }

    private boolean hasUploadedFile(MultipartFile... files) {
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                return true;
            }
        }
        return false;
    }

    @FunctionalInterface
    private interface FileSetter {
        void set(byte[] bytes);
    }
}
