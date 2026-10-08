import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 12,
    padding: 1.5, // Thin gradient border width
    marginBottom: 16,
  },
  innerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10.5, // Slightly smaller than wrapper to fit perfectly
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#083B75',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
});
