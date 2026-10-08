import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#083B75',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#083B75',
  },
  editBtn: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F97316',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  dataLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  dataValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
    textAlign: 'right',
  },
});
