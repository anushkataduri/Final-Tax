import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  subtitle: { fontSize: 13 },
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
  iconContainer: {
    backgroundColor: colors.primary + '15',
  },
  title: {
    color: colors.text,
  },
  subtitle: {
    color: colors.textSecondary,
  },
});
