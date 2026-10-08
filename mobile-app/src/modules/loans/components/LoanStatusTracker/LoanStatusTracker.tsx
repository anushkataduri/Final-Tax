import React from "react";
import { StatusTimeline, type StatusTimelineProps } from "../../../../shared/components/ProgressStepper/StatusTimeline";

export const LoanStatusTracker: React.FC<StatusTimelineProps> = (props) => {
  return <StatusTimeline {...props} />;
};

export default LoanStatusTracker;
