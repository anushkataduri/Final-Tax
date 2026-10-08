import React from "react";
import { ServiceCard, type ServiceCardProps } from "../../../../shared/components/ServiceCard/ServiceCard";

export const LoanCard: React.FC<ServiceCardProps> = (props) => {
  return <ServiceCard {...props} />;
};

export default LoanCard;
