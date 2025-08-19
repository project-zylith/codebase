import { appleAuth } from "@invertase/react-native-apple-authentication";
import { API_ENDPOINTS } from "../utils/apiConfig";

export interface AppleAuthResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email?: string;
    token: string;
  };
  error?: string;
}

export interface AppleAuthRequest {
  identityToken: string;
  authorizationCode: string;
  user: string;
  email?: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
}

class AppleAuthService {
  /**
   * Check if Apple Sign In is available on this device
   */
  async isAvailable(): Promise<boolean> {
    try {
      return await appleAuth.isSupported;
    } catch (error) {
      console.error("Error checking Apple Sign In availability:", error);
      return false;
    }
  }

  /**
   * Perform Apple Sign In
   */
  async signIn(): Promise<AppleAuthResponse> {
    try {
      console.log("🍎 Starting Apple Sign In...");

      // First check if Apple Sign In is supported
      const isSupported = await this.isAvailable();
      if (!isSupported) {
        return {
          success: false,
          error:
            "Apple Sign In is not supported on this device. It requires iOS 13 or later.",
        };
      }

      // Request Apple authentication
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log("✅ Apple authentication successful");

      // Extract user information
      const { identityToken, authorizationCode, user, email, fullName } =
        appleAuthRequestResponse;

      if (!identityToken || !authorizationCode || !user) {
        throw new Error("Missing required Apple authentication data");
      }

      // Send to your backend for validation and user creation/login
      const authResult = await this.authenticateWithBackend({
        identityToken,
        authorizationCode,
        user,
        email,
        fullName,
      });

      return authResult;
    } catch (error: any) {
      console.error("❌ Apple Sign In failed:", error);
      console.error("❌ Error details:", {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: error.stack,
      });

      let errorMessage = "Apple Sign In failed. Please try again.";

      // Handle specific Apple Auth errors
      if (error.code === appleAuth.Error.CANCELED) {
        errorMessage = "Sign In was cancelled.";
      } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
        errorMessage = "Invalid response from Apple. Please try again.";
      } else if (error.code === appleAuth.Error.NOT_HANDLED) {
        errorMessage = "Sign In request was not handled.";
      } else if (error.code === appleAuth.Error.UNKNOWN) {
        // Provide more specific error message based on the actual error
        if (error.message) {
          errorMessage = `Apple Sign In error: ${error.message}`;
        } else {
          errorMessage =
            "Apple Sign In encountered an unknown error. Please check your device settings and try again.";
        }
      } else if (
        error.message &&
        error.message.includes("AppleAuth is not supported")
      ) {
        errorMessage =
          "Apple Sign In is not supported on this device. It requires iOS 13 or later.";
      } else if (error.message) {
        // Use the actual error message if available
        errorMessage = `Apple Sign In error: ${error.message}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Authenticate with your backend using Apple credentials
   */
  private async authenticateWithBackend(
    authData: AppleAuthRequest
  ): Promise<AppleAuthResponse> {
    try {
      console.log("🔐 Authenticating with backend...");
      console.log("🔐 Backend URL:", API_ENDPOINTS.AUTH.APPLE_SIGN_IN);
      console.log("🔐 Auth data being sent:", {
        identityToken: authData.identityToken
          ? `${authData.identityToken.substring(0, 20)}...`
          : "undefined",
        authorizationCode: authData.authorizationCode
          ? `${authData.authorizationCode.substring(0, 20)}...`
          : "undefined",
        user: authData.user,
        email: authData.email,
        fullName: authData.fullName,
      });

      const response = await fetch(API_ENDPOINTS.AUTH.APPLE_SIGN_IN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      });

      console.log("🔐 Backend response status:", response.status);
      console.log("🔐 Backend response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("🔐 Backend error response:", errorData);
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Backend authentication successful");
      console.log("✅ Backend result:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Backend authentication failed:", error);
      console.error("❌ Backend error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      return {
        success: false,
        error: error.message || "Failed to authenticate with server",
      };
    }
  }

  /**
   * Sign out (if needed for Apple-specific cleanup)
   */
  async signOut(): Promise<void> {
    try {
      // Apple doesn't require explicit sign out, but you can add any cleanup here
      console.log("🍎 Apple Sign In cleanup completed");
    } catch (error) {
      console.error("Error during Apple Sign In cleanup:", error);
    }
  }

  /**
   * Get current Apple user state
   */
  async getCurrentUser(): Promise<string | null> {
    try {
      const currentUser = await appleAuth.getCredentialStateForUser(
        "current-user-id"
      );
      return currentUser === appleAuth.State.AUTHORIZED
        ? "current-user-id"
        : null;
    } catch (error) {
      console.error("Error getting current Apple user:", error);
      return null;
    }
  }
}

export const appleAuthService = new AppleAuthService();
export default appleAuthService;
