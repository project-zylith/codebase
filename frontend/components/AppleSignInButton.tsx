import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAppleSignIn } from "../hooks/useAppleSignIn";
import { useUser } from "../contexts/UserContext";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { storeToken } from "../adapters/userAdapters";
import { Ionicons } from "@expo/vector-icons";

interface AppleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const { signIn, isLoading, error, clearError } = useAppleSignIn();
  const { login } = useUser();
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const alertShownRef = useRef(false);

  useEffect(() => {
    // Check if Apple Sign In is supported on this device
    const checkSupport = async () => {
      try {
        const supported = await appleAuth.isSupported;
        setIsSupported(supported);

        // Show alert if not supported and we haven't shown it yet
        if (!supported && !alertShownRef.current) {
          alertShownRef.current = true;
          Alert.alert(
            "Apple Sign In Not Available",
            "Apple Sign In requires iOS 13 or later on this device.",
            [{ text: "OK" }]
          );
        }
      } catch (err) {
        console.log("Error checking Apple Auth support:", err);
        setIsSupported(false);

        // Show alert if there's an error and we haven't shown it yet
        if (!alertShownRef.current) {
          alertShownRef.current = true;
          Alert.alert(
            "Apple Sign In Not Available",
            "Apple Sign In requires iOS 13 or later on this device.",
            [{ text: "OK" }]
          );
        }
      }
    };

    checkSupport();
  }, []);

  const handleAppleSignIn = async () => {
    try {
      console.log("🍎 Starting Apple Sign In process...");
      const result = await signIn();
      console.log("🍎 Sign In result:", result);

      if (result.success && result.user) {
        // Store the JWT token from Apple Sign In
        if (result.user.token) {
          await storeToken(result.user.token);
          console.log("✅ Apple Sign In token stored");

          // Now get the full user data from the backend using the token
          // The UserContext will handle this automatically when the app checks for stored sessions
          onSuccess?.();
        } else {
          console.error("❌ No token received from Apple Sign In");
          onError?.("No authentication token received");
        }
      } else {
        console.error("❌ Apple Sign In failed:", result.error);
        onError?.(result.error || "Apple Sign In failed");
      }
    } catch (error) {
      console.error("❌ Apple Sign In exception:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Apple Sign In failed";
      onError?.(errorMessage);
    }
  };

  // Don't show the button if Apple Sign In is not supported
  if (isSupported === false) {
    return null;
  }

  // Show loading state while checking support
  if (isSupported === null) {
    return null;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={clearError} style={styles.errorCloseButton}>
          <Text style={styles.errorCloseButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.appleButton, isLoading && styles.appleButtonDisabled]}
      onPress={handleAppleSignIn}
      disabled={isLoading}
    >
      <View style={styles.buttonContent}>
        <Ionicons
          name="logo-apple"
          size={20}
          color="#fff"
          style={styles.appleIcon}
        />
        <Text style={styles.appleButtonText}>
          {isLoading ? "Signing in..." : "Sign in with Apple"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appleButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  appleButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  appleIcon: {
    marginRight: 8,
  },
  appleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    flex: 1,
  },
  errorCloseButton: {
    marginLeft: 8,
    padding: 4,
  },
  errorCloseButtonText: {
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "bold",
  },
});
