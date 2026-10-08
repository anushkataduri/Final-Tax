import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export const getThemedStyles = (colors: {
  background: string;
  backgroundElement: string;
  text: string;
  textSecondary: string;
}) => ({
  container: {
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.backgroundElement,
  },
  cardTitle: {
    color: colors.text,
  },
  cardValue: {
    color: colors.textSecondary,
  },
});
