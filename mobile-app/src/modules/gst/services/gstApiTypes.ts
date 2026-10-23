/** DTO types for GST API responses. Avoids `get<any>` / `post<any>` in gstApi.ts. */

export interface GstBusinessDto {
  id?: string;
  gstId?: string;
  customerId?: string;
  gstin?: string;
  businessName?: string;
  legalName?: string;
  tradeName?: string;
  businessType?: string;
  registrationDate?: string;
  state?: string;
  stateCode?: string;
  status?: string;
  annualTurnover?: number | string;
  constitutionOfBusiness?: string;
  natureOfBusiness?: string;
  placeOfBusiness?: string;
  dateOfCommencement?: string;
  reasonForRegistration?: string;
  compositionScheme?: string;
  businessAddress?: string;
  city?: string;
  district?: string;
  pinCode?: string;
  hsnSac?: string;
  accountHolderName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
  accountType?: string;
  signatoryName?: string;
  signatoryPan?: string;
  signatoryDob?: string;
  designation?: string;
  signatoryMobile?: string;
  signatoryEmail?: string;
  appliedDate?: string;
  additionalAddress?: string;
  [key: string]: unknown;
}

export interface GstDocumentsDto {
  id?: string;
  documentId?: string;
  panCard?: string;
  aadhaarCard?: string;
  identityAddressProof?: string;
  passportPhoto?: string;
  passportSizePhotograph?: string;
  principalPlaceAddressProof?: string;
  principalPlaceAddressType?: string;
  businessRegistrationProof?: string;
  bankPassbookOrCancelledCheque?: string;
  status?: string;
  [key: string]: unknown;
}

export interface GstRegistrationResponseDto {
  id?: string;
  gstId?: string;
  customerId?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

export interface GstTimelineStepDto {
  title: string;
  description?: string;
  status: string;
  date?: string;
  updatedAt?: string;
}

export interface GstStatusResponseDto {
  status: string;
  timeline: GstTimelineStepDto[];
  [key: string]: unknown;
}

export interface GstCancellationResponseDto {
  id?: string;
  cancellationId?: string;
  status?: string;
  arn?: string;
  message?: string;
  [key: string]: unknown;
}

export interface GstComplianceDto {
  id?: string;
  complianceId?: string;
  customerId?: string;
  gstin?: string;
  financialYear?: string;
  requestType?: string;
  status?: string;
  noticeNumber?: string;
  noticeIssueDate?: string;
  replyDueDate?: string;
  gstr2bNumber?: string;
  message?: string;
  submittedAt?: string;
  [key: string]: unknown;
}
