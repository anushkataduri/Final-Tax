import React from 'react';
import { View } from 'react-native';
import { StepClassification } from './StepClassification';
import { StepBusinessActivity } from './StepBusinessActivity';
import { StepProposedNames } from './StepProposedNames';
import { styles } from './StepCombinedDetails.styles';

export const StepCombinedDetails: React.FC = () => {
  return (
    <View style={styles.container}>
      <StepClassification />
      <View style={styles.sectionSpacing} />
      <StepBusinessActivity />
      <View style={styles.sectionSpacing} />
      <StepProposedNames />
    </View>
  );
};

export default StepCombinedDetails;
