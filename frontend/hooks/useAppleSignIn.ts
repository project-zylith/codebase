import { useState, useCallback } from "react";
import {
  appleAuthService,
  AppleAuthResponse,
} from "../services/appleAuthService";

export interface UseAppleSignInReturn {
  // State
  isLoading: boolean;
  error: string | null;
  isAvailable: boolean;

  // Actions
  signIn: () => Promise<AppleAuthResponse>;
  signOut: () => Promise<void>;

  // Utilities
  clearError: () => void;
  checkAvailability: () => Promise<void>;
}

export const useAppleSignIn = (): UseAppleSignInReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkAvailability = useCallback(async () => {
    try {
      const available = await appleAuthService.isAvailable();
      setIsAvailable(available);
    } catch (err: any) {
      console.error("Error checking Apple Sign In availability:", err);
      setIsAvailable(false);
    }
  }, []);

  const signIn = useCallback(async (): Promise<AppleAuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🍎 Starting Apple Sign In...");

      const result = await appleAuthService.signIn();

      if (!result.success) {
        setError(result.error || "Apple Sign In failed");
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Apple Sign In failed";
      setError(errorMessage);
      console.error("❌ Apple Sign In error:", errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await appleAuthService.signOut();
      console.log("✅ Apple Sign In sign out completed");
    } catch (err: any) {
      console.error("❌ Apple Sign In sign out error:", err);
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    isAvailable,

    // Actions
    signIn,
    signOut,

    // Utilities
    clearError,
    checkAvailability,
  };
};
