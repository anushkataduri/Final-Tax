import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
});

export const getThemedStyles = (colors: { background: string }) => ({
  container: {
    backgroundColor: colors.background,
  },
});
