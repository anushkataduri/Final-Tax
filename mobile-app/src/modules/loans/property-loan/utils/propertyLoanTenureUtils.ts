export const PURPOSES = [
  "Commercial Property Purchase",
  "Residential Property Mortgage (LAP)",
  "Commercial Mortgage Loan",
  "Industrial Factory / Land Mortgage",
  "Lease Rental Discounting (LRD)",
  "Business Expansion & Debt Consolidation",
  "Others",
];

export const TENURE_PRESETS = [
  { label: "12 Mos (1 Yr)", value: "12" },
  { label: "24 Mos (2 Yrs)", value: "24" },
  { label: "36 Mos (3 Yrs)", value: "36" },
  { label: "60 Mos (5 Yrs)", value: "60" },
  { label: "84 Mos (7 Yrs)", value: "84" },
  { label: "120 Mos (10 Yrs)", value: "120" },
  { label: "240 Mos (20 Yrs)", value: "240" },
];

export const APPLICANT_TYPES = [
  "Individual / Salaried",
  "Self-Employed Professional",
  "Business Owner / Proprietorship",
  "Partnership / LLP",
  "Private Limited Company",
];

export const formatTenureEquivalent = (monthsStr: string): string => {
  if (!monthsStr) return "";
  const months = parseInt(monthsStr, 10);
  if (isNaN(months) || months <= 0) return "";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  if (remainingMonths === 0) {
    return `${months} months (${years} ${years === 1 ? "year" : "years"})`;
  }

  return `${months} months (${years} ${years === 1 ? "year" : "years"} ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"})`;
};

export const isPresetTenure = (val?: string) =>
  Boolean(val && TENURE_PRESETS.some((item) => item.value === val));
