package com.taxedge.loan.propertyloan.service;

import java.util.List;

import com.taxedge.loan.propertyloan.dto.PropertyLoanCreateRequest;
import com.taxedge.loan.propertyloan.dto.PropertyLoanResponse;
import com.taxedge.loan.propertyloan.dto.PropertyLoanReviewResponse;
import com.taxedge.loan.propertyloan.dto.PropertyLoanUpdateRequest;

public interface PropertyLoanApplicationService {

    PropertyLoanResponse createApplication(PropertyLoanCreateRequest request);

    PropertyLoanResponse getApplication(String id);

    PropertyLoanResponse updateApplication(String id, PropertyLoanUpdateRequest request);

    void deleteApplication(String id);

    PropertyLoanReviewResponse getReview(String id);

    PropertyLoanResponse submitApplication(String id);

    List<PropertyLoanResponse> getMyApplications();
}
