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
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 12,
  },
  note: {
    fontSize: 13,
    textAlign: 'center',
  },
});

export const getThemedStyles = (colors: {
  background: string;
  backgroundElement: string;
  text: string;
  primary: string;
  textSecondary: string;
}) => ({
  container: {
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.backgroundElement,
  },
  title: {
    color: colors.text,
  },
  amount: {
    color: colors.primary,
  },
  note: {
    color: colors.textSecondary,
  },
});
