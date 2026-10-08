import { ItrFilingFormData } from "../itr-filing/types/itrFiling.types";
import { calculateItrTax } from "../itr-filing/engine/itrTaxCalculator";
import { determineApplicableItrForm } from "../itr-filing/engine/itrFormEngine";
import { generateDynamicDocumentChecklist } from "../itr-filing/engine/itrDocumentEngine";

export const recalculateItrForm = (formData: ItrFilingFormData): ItrFilingFormData => {
  const ay = formData.personalInfo.assessmentYear;
  const calculation = calculateItrTax(
    formData.incomeSources,
    formData.deductions,
    formData.taxesPaid,
    formData.regime,
    ay
  );
  const determinedForm = determineApplicableItrForm(
    formData.incomeSources,
    formData.personalInfo.residentialStatus,
    calculation.grossTotalIncome,
    ay
  );
  const documents = generateDynamicDocumentChecklist(
    formData.incomeSources,
    formData.priorItrNotice,
    formData.deductions,
    formData.taxesPaid,
    formData.regime,
    formData.personalInfo,
    formData.documents
  );
  return { ...formData, calculation, determinedForm, documents };
};
