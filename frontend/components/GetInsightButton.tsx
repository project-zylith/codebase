// DEPRECATED: This component is not being used. Insight functionality is integrated directly into the editor.
// This file can be safely deleted after testing.

/*
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

interface GetInsightButtonProps {
  onPress: () => void;
}

export const GetInsightButton: React.FC<GetInsightButtonProps> = ({ onPress }) => {
  const { currentPalette } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: currentPalette.quaternary }]}
      onPress={onPress}
    >
      <Ionicons name="bulb" size={20} color={currentPalette.tertiary} />
      <Text style={[styles.buttonText, { color: currentPalette.tertiary }]}>
        Get Insight
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
*/
