package com.taxedge.itr.tdsrefund.service;

import com.taxedge.itr.tdsrefund.dto.TdsTaxesPaidDto;

public interface TdsTaxesPaidService {

    String saveTaxesPaid(TdsTaxesPaidDto dto);

    String updateTaxesPaid(Long id, TdsTaxesPaidDto dto);
    
    TdsTaxesPaidDto      getTaxesPaid(String tdsRefundId);
}
