import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
});

export const getThemedStyles = (colors: { background: string; text: string }) => ({
  container: {
    backgroundColor: colors.background,
  },
  sectionTitle: {
    color: colors.text,
  },
});
