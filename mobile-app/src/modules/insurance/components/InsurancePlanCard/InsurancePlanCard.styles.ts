import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  provider: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  planName: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  coverBadge: { backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  coverText: { color: '#0369A1', fontSize: 12, fontWeight: '700' },
  metricsRow: { flexDirection: 'row', gap: 24, marginBottom: 12 },
  metric: {},
  metricLabel: { fontSize: 11, marginBottom: 2 },
  metricValue: { fontSize: 14, fontWeight: '700' },
  featuresList: { marginBottom: 14 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  featureText: { fontSize: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  premiumLabel: { fontSize: 11 },
  premiumValue: { fontSize: 16, fontWeight: '800' },
  button: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
});

export const getThemedStyles = (colors: {
  backgroundElement: string;
  border: string;
  primary: string;
  text: string;
  textSecondary: string;
}) => ({
  card: {
    backgroundColor: colors.backgroundElement,
    borderColor: colors.border,
  },
  provider: {
    color: colors.primary,
  },
  planName: {
    color: colors.text,
  },
  metricLabel: {
    color: colors.textSecondary,
  },
  metricValue: {
    color: colors.text,
  },
  featureText: {
    color: colors.textSecondary,
  },
  premiumLabel: {
    color: colors.textSecondary,
  },
  premiumValue: {
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
  },
});
