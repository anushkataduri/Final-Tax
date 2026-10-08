import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#083B75',
    marginBottom: 6,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: '#083B75',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnSecondary: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#083B75',
  },
});
