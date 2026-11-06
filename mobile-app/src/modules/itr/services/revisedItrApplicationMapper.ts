import type { Application, ApplicationDocument, TimelineStep } from "@/types/domain";

export interface RevisedItrBackendDto {
  revisedItrId: string;
  applicationType?: string;
  status: string;
  assignedAgentId?: number | null;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;

  // Step 1: Base & Assessment info
  assessmentYear?: string;
  itrAcknowledgementNumber?: string;

  // Step 2: Revised Details
  salaryBusinessIncome?: string;
  otherIncome?: string;
  deduction80C?: string;
  deduction80D?: string;
  homeLoanInterest?: string;
  taxableIncome?: string;
  bankAccountForRefund?: string;

  // Step 3: Revision Reason
  reason?: string;
  otherReason?: string;

  // Step 4: Documents flags
  panCardUploaded?: boolean;
  aadhaarCardUploaded?: boolean;
  form16Uploaded?: boolean;
  aisTisStatementUploaded?: boolean;
  bankStatementsUploaded?: boolean;
}

export function mapRevisedItrBackendToApplication(dto: RevisedItrBackendDto): Application {
  const ay = dto.assessmentYear ? `AY ${dto.assessmentYear}` : "Revised ITR";
  const serviceName = `Revised ITR (${ay})`;

  const documents: ApplicationDocument[] = [
    { name: "PAN Card", status: dto.panCardUploaded ? "Uploaded" : "Pending" },
    { name: "Aadhaar Card", status: dto.aadhaarCardUploaded ? "Uploaded" : "Pending" },
    { name: "Form 16 / Form 16A", status: dto.form16Uploaded ? "Uploaded" : "Pending" },
    { name: "AIS / TIS Statement", status: dto.aisTisStatementUploaded ? "Uploaded" : "Pending" },
    { name: "Bank Statements", status: dto.bankStatementsUploaded ? "Uploaded" : "Pending" },
  ];

  const timeline: TimelineStep[] = [
    {
      title: "Revised ITR Submitted",
      description: "Your revised income tax return has been submitted.",
      status: "completed",
      date: dto.submittedAt || dto.createdAt,
    },
    {
      title: "Revision Computation & Review",
      description: "Chartered Accountants are recomputing and verifying amended deductions.",
      status: dto.status === "SUBMITTED" ? "current" : "pending",
    },
    {
      title: "Revised ITR Acknowledgement",
      description: "Updated ITR-V will be issued upon filing.",
      status: "pending",
    },
  ];

  return {
    id: dto.revisedItrId,
    serviceId: "revised-itr",
    serviceName,
    category: "ITR",
    status: dto.status || "SUBMITTED",
    progress: dto.status === "SUBMITTED" ? 25 : 10,
    assignedExecutive: dto.assignedAgentId ? `Agent #${dto.assignedAgentId}` : "Under Assignment",
    paymentAmount: 0,
    paymentStatus: "Paid",
    createdAt: dto.createdAt || new Date().toISOString(),
    formData: {
      ...dto,
      applicantName: dto.itrAcknowledgementNumber ? `Ack: ${dto.itrAcknowledgementNumber}` : "Revised ITR",
      businessName: dto.itrAcknowledgementNumber ? `Ack: ${dto.itrAcknowledgementNumber}` : "Revised ITR",
      itrAcknowledgementNumber: dto.itrAcknowledgementNumber,
      assessmentYear: dto.assessmentYear,
      submissionDate: dto.submittedAt || dto.createdAt,
      appliedDate: dto.submittedAt || dto.createdAt,
      arn: dto.revisedItrId,
    },
    documents,
    timeline,
    chatHistory: [],
  };
}
