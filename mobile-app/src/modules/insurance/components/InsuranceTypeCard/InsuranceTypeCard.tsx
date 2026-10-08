import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../../hooks/use-theme';
import type { InsuranceCategory } from '../../types/insurance.types';
import { styles, getThemedStyles } from './InsuranceTypeCard.styles';

interface InsuranceTypeCardProps {
  category: InsuranceCategory;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const InsuranceTypeCard: React.FC<InsuranceTypeCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
}) => {
  const colors = useTheme();
  const themed = getThemedStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.card, themed.card]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, themed.iconContainer]}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, themed.title]}>{title}</Text>
        <Text style={[styles.subtitle, themed.subtitle]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default InsuranceTypeCard;
