import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './CompanySectionCard.styles';

export interface CompanySectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const CompanySectionCard: React.FC<CompanySectionCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <LinearGradient
      colors={['rgba(249, 115, 22, 0.4)', 'rgba(249, 115, 22, 0.1)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientWrapper}
    >
      <View style={styles.innerCard}>
        {title && <Text style={styles.title}>{title}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
        {children}
      </View>
    </LinearGradient>
  );
};

export default CompanySectionCard;
