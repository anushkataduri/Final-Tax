package com.taxedge.itr.tdsrefund.service;

import com.taxedge.itr.tdsrefund.dto.IncomeTaxInfoDto;

public interface IncomeTaxInfoService {

    String saveIncomeTaxInfo(IncomeTaxInfoDto dto);

    String updateIncomeTaxInfo(Long id, IncomeTaxInfoDto dto);
    
    IncomeTaxInfoDto     getIncomeTaxInfo(String tdsRefundId);
}
