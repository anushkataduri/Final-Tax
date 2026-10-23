import type { TdsCustomerIncomeFormData } from "../types/customerIncome.types";
import type { TdsDocumentItem } from "../types/tdsDocuments.types";
import type { RefundBankAccountDto, IncomeTaxInfoDto, TdsTaxesPaidDto } from "./tdsApiTypes";

export function mapBankDto(bankDto: RefundBankAccountDto): TdsCustomerIncomeFormData["bank"] {
  return {
    accountHolderName: bankDto.accountHolderName || "",
    accountNumber: bankDto.accountNumber || "",
    confirmAccountNumber: bankDto.confirmAccountNumber || bankDto.accountNumber || "",
    ifscCode: bankDto.ifscCode || "",
    bankName: bankDto.bankName || "",
    branchName: bankDto.branchName || "",
    accountType: (bankDto.accountType?.toLowerCase() === "current" ? "current" : "savings") as "current" | "savings",
    isIfscVerified: Boolean(bankDto.bankName),
  };
}

export function mapBusinessDto(bankDto: RefundBankAccountDto): TdsCustomerIncomeFormData["business"] {
  return {
    legalName: bankDto.legalBusinessName || "",
    pan: bankDto.businessPan || "",
    aadhaar: bankDto.aadhaarNumber || "",
    mobileNumber: bankDto.mobileNumber || "",
  };
}

export function mapIncomeDto(
  incomeDto: IncomeTaxInfoDto | null,
  taxesPaidDto: TdsTaxesPaidDto | null,
): Partial<TdsCustomerIncomeFormData["income"]> {
  return {
    salaryIncome: incomeDto?.salaryIncome ? String(incomeDto.salaryIncome) : "",
    otherIncome: incomeDto?.otherIncome ? String(incomeDto.otherIncome) : "",
    interestIncome: incomeDto?.interestIncome ? String(incomeDto.interestIncome) : "",
    rentalIncome: incomeDto?.rentalIncome ? String(incomeDto.rentalIncome) : "",
    hasRentalIncome: Boolean(incomeDto?.rentalIncome && incomeDto.rentalIncome > 0),
    municipalTaxesPaid: incomeDto?.municipalTaxesPaid ? String(incomeDto.municipalTaxesPaid) : "",
    shortTermCapitalGains: incomeDto?.shortTermCapitalGains ? String(incomeDto.shortTermCapitalGains) : "",
    longTermCapitalGains: incomeDto?.longTermCapitalGains ? String(incomeDto.longTermCapitalGains) : "",
    hasCapitalGains: Boolean(
      (incomeDto?.shortTermCapitalGains && incomeDto.shortTermCapitalGains > 0) ||
      (incomeDto?.longTermCapitalGains && incomeDto.longTermCapitalGains > 0),
    ),
    grossTurnover: incomeDto?.grossTurnover ? String(incomeDto.grossTurnover) : "",
    netBusinessProfit: incomeDto?.netBusinessProfit ? String(incomeDto.netBusinessProfit) : "",
    hasBusinessIncome: Boolean(incomeDto?.netBusinessProfit && incomeDto.netBusinessProfit > 0),
    homeLoanInterestSec24b: incomeDto?.homeLoanInterestSec24b ? String(incomeDto.homeLoanInterestSec24b) : "",
    hasHomeLoan: Boolean(incomeDto?.homeLoanInterestSec24b && incomeDto.homeLoanInterestSec24b > 0),
    deductions80C: incomeDto?.deductions80C ? String(incomeDto.deductions80C) : "",
    deductions80D: incomeDto?.deductions80D ? String(incomeDto.deductions80D) : "",
    hasDeductions: Boolean(
      (incomeDto?.deductions80C && incomeDto.deductions80C > 0) ||
      (incomeDto?.deductions80D && incomeDto.deductions80D > 0),
    ),
    totalTdsDeducted: taxesPaidDto?.totalTdsDeducted ? String(taxesPaidDto.totalTdsDeducted) : "",
    tcsAmount: taxesPaidDto?.tcsAmount ? String(taxesPaidDto.tcsAmount) : "",
    advanceTaxPaid: taxesPaidDto?.advanceTax ? String(taxesPaidDto.advanceTax) : "",
    selfAssessmentTaxPaid: taxesPaidDto?.selfAssessmentTax ? String(taxesPaidDto.selfAssessmentTax) : "",
  };
}

export type FetchedTdsApplication = {
  tdsRefundId: string | null;
  bank?: TdsCustomerIncomeFormData["bank"];
  business?: TdsCustomerIncomeFormData["business"];
  income?: TdsCustomerIncomeFormData["income"];
  documents?: TdsDocumentItem[];
};
