import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    width: '100%',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  backBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  nextBtn: {
    flex: 2,
    backgroundColor: '#F97316',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
