package com.taxedge.gst.service;

import com.taxedge.gst.dto.BusinessDto;

public interface BusinessService {

    String registerBusiness(BusinessDto businessDto);

    String updateBusiness(String businessId, BusinessDto businessDto);

    BusinessDto getBusinessId(String businessId);
}