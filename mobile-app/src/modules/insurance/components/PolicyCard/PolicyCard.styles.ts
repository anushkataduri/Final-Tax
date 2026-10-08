import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  provider: { fontSize: 12, fontWeight: '600' },
  plan: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { color: '#15803D', fontSize: 11, fontWeight: '700' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  policyNum: { fontSize: 12 },
  validity: { fontSize: 12 },
});

export const getThemedStyles = (colors: {
  backgroundElement: string;
  border: string;
  textSecondary: string;
  text: string;
}) => ({
  card: {
    backgroundColor: colors.backgroundElement,
    borderColor: colors.border,
  },
  provider: {
    color: colors.textSecondary,
  },
  plan: {
    color: colors.text,
  },
  policyNum: {
    color: colors.textSecondary,
  },
  validity: {
    color: colors.textSecondary,
  },
});
