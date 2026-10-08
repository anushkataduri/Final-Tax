import React from "react";
import { PersonalDetails } from "../../types/customerIncome.types";
import { TdsRefundPersonalInfoCard } from "../../components/personal/TdsRefundPersonalInfoCard";

interface PersonalInfoSectionProps {
  personal: PersonalDetails;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onSaveProfile: (updated: PersonalDetails) => Promise<void>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personal,
  isLoading,
  errorMessage,
  onRetry,
  onSaveProfile,
}) => (
  <TdsRefundPersonalInfoCard
    personalData={personal}
    isLoading={isLoading}
    isError={Boolean(errorMessage)}
    errorMessage={errorMessage || undefined}
    onRetry={onRetry}
    onSaveProfile={onSaveProfile}
  />
);

