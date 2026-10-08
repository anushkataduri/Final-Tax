import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  heading: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600' },
  divider: { height: 1, marginVertical: 8 },
  totalLabel: { fontSize: 15, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '800' },
});

export const getThemedStyles = (colors: {
  backgroundElement: string;
  border: string;
  text: string;
  textSecondary: string;
  primary: string;
}) => ({
  card: {
    backgroundColor: colors.backgroundElement,
    borderColor: colors.border,
  },
  heading: {
    color: colors.text,
  },
  label: {
    color: colors.textSecondary,
  },
  value: {
    color: colors.text,
  },
  divider: {
    backgroundColor: colors.border,
  },
  totalLabel: {
    color: colors.text,
  },
  totalValue: {
    color: colors.primary,
  },
});
