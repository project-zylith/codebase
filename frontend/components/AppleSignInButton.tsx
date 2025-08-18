import React, { useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useAppleSignIn } from "../hooks/useAppleSignIn";

interface AppleSignInButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
}

export const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({
  onSuccess,
  onError,
  style,
  textStyle,
  disabled = false,
}) => {
  const { currentPalette } = useTheme();
  const {
    isLoading,
    error,
    isAvailable,
    signIn,
    clearError,
    checkAvailability,
  } = useAppleSignIn();

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
      clearError();
    }
  }, [error, onError, clearError]);

  const handleSignIn = async () => {
    try {
      const result = await signIn();

      if (result.success && result.user && onSuccess) {
        onSuccess(result.user);
      }
    } catch (err: any) {
      if (onError) {
        onError(err.message || "Apple Sign In failed");
      }
    }
  };

  // Temporarily disabled - return null to hide the button
  // TODO: Re-enable when App Store Connect is configured
  return null;

  // Original availability check (commented out for now)
  // if (!isAvailable) {
  //   return null; // Don't show button if Apple Sign In is not available
  // }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: currentPalette.quaternary },
        style,
        disabled && styles.disabled,
      ]}
      onPress={handleSignIn}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={currentPalette.tertiary} size="small" />
      ) : (
        <View style={styles.content}>
          <Ionicons
            name="logo-apple"
            size={20}
            color={currentPalette.tertiary}
            style={styles.icon}
          />
          <Text
            style={[styles.text, { color: currentPalette.tertiary }, textStyle]}
          >
            Sign in with Apple
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    minHeight: 48,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});

export default AppleSignInButton;
