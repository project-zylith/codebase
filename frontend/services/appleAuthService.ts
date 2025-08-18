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

      let errorMessage = "Apple Sign In failed. Please try again.";

      if (error.code === appleAuth.Error.CANCELED) {
        errorMessage = "Sign In was cancelled.";
      } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
        errorMessage = "Invalid response from Apple. Please try again.";
      } else if (error.code === appleAuth.Error.NOT_HANDLED) {
        errorMessage = "Sign In request was not handled.";
      } else if (error.code === appleAuth.Error.UNKNOWN) {
        errorMessage = "An unknown error occurred. Please try again.";
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

      const response = await fetch(API_ENDPOINTS.AUTH.APPLE_SIGN_IN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Backend authentication successful");
      return result;
    } catch (error: any) {
      console.error("❌ Backend authentication failed:", error);
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
