import React from 'react';
import { StatusTimeline } from '../../../../shared/components/ProgressStepper/StatusTimeline';
import type { TimelineStep } from '../../../../shared/types/domain';

export interface RegistrationStatusTrackerProps {
  steps: TimelineStep[];
}

export const RegistrationStatusTracker: React.FC<RegistrationStatusTrackerProps> = ({ steps }) => {
  return <StatusTimeline steps={steps} />;
};
export default RegistrationStatusTracker;
