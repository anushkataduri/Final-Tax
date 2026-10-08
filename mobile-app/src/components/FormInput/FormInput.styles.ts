import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  requiredAsterisk: {
    fontWeight: "700",
  },
});
