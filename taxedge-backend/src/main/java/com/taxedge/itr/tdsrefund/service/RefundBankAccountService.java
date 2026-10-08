package com.taxedge.itr.tdsrefund.service;

import com.taxedge.itr.tdsrefund.dto.RefundBankAccountDto;

public interface RefundBankAccountService {

    String saveBankAccount(RefundBankAccountDto dto);

    String updateBankAccount(String id, RefundBankAccountDto dto);
    
    RefundBankAccountDto getBankAccount(String id);

    RefundBankAccountDto getBankAccountByCustId(String custId);
}

