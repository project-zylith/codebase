import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useAppleIAP } from "../hooks/useAppleIAP";
import { PRODUCT_IDS, ProductId } from "../services/iapService";

interface AppleIAPExampleProps {
  userToken: string;
  userId: number;
}

export const AppleIAPExample: React.FC<AppleIAPExampleProps> = ({
  userToken,
  userId,
}) => {
  const { currentPalette } = useTheme();
  const {
    isLoading,
    error,
    currentSubscription,
    purchaseProduct,
    validateReceipt,
    refreshReceipt,
    checkReceiptStatus,
    checkSubscriptionActive,
    clearError,
    resetState,
  } = useAppleIAP();

  const [testReceiptData, setTestReceiptData] = useState(
    "test_receipt_data_123"
  );

  const handlePurchase = async (productId: ProductId) => {
    try {
      await purchaseProduct(productId, userToken, userId);
      Alert.alert("Success", "Purchase completed and receipt validated!");
    } catch (error: any) {
      Alert.alert("Purchase Failed", error.message);
    }
  };

  const handleValidateReceipt = async () => {
    try {
      await validateReceipt(testReceiptData, userToken, userId);
      Alert.alert("Success", "Receipt validated successfully!");
    } catch (error: any) {
      Alert.alert("Validation Failed", error.message);
    }
  };

  const handleRefreshReceipt = async () => {
    if (!currentSubscription?.id) {
      Alert.alert("No Subscription", "No active subscription to refresh.");
      return;
    }

    try {
      await refreshReceipt(currentSubscription.id, userToken);
      Alert.alert("Success", "Receipt refreshed successfully!");
    } catch (error: any) {
      Alert.alert("Refresh Failed", error.message);
    }
  };

  const handleCheckStatus = async () => {
    if (!currentSubscription?.id) {
      Alert.alert("No Subscription", "No active subscription to check.");
      return;
    }

    try {
      await checkReceiptStatus(currentSubscription.id, userToken);
      Alert.alert("Success", "Receipt status checked successfully!");
    } catch (error: any) {
      Alert.alert("Status Check Failed", error.message);
    }
  };

  const handleCheckActive = async () => {
    if (!currentSubscription?.id) {
      Alert.alert("No Subscription", "No active subscription to check.");
      return;
    }

    try {
      const isActive = await checkSubscriptionActive(
        currentSubscription.id,
        userToken
      );
      Alert.alert(
        "Subscription Status",
        `Your subscription is ${isActive ? "ACTIVE" : "INACTIVE"}`
      );
    } catch (error: any) {
      Alert.alert("Status Check Failed", error.message);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentPalette.primary }]}
    >
      <Text style={[styles.title, { color: currentPalette.tertiary }]}>
        Apple IAP Testing
      </Text>

      {/* Error Display */}
      {error && (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: currentPalette.quinary + "20" },
          ]}
        >
          <Text style={[styles.errorText, { color: currentPalette.quinary }]}>
            {error}
          </Text>
          <TouchableOpacity onPress={clearError} style={styles.errorButton}>
            <Text
              style={[
                styles.errorButtonText,
                { color: currentPalette.quinary },
              ]}
            >
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Current Subscription */}
      {currentSubscription && (
        <View
          style={[
            styles.subscriptionCard,
            { backgroundColor: currentPalette.card },
          ]}
        >
          <Text
            style={[
              styles.subscriptionTitle,
              { color: currentPalette.tertiary },
            ]}
          >
            Current Subscription
          </Text>
          <Text
            style={[styles.subscriptionText, { color: currentPalette.quinary }]}
          >
            ID: {currentSubscription.id}
          </Text>
          <Text
            style={[styles.subscriptionText, { color: currentPalette.quinary }]}
          >
            Status: {currentSubscription.status}
          </Text>
          <Text
            style={[styles.subscriptionText, { color: currentPalette.quinary }]}
          >
            Apple Product: {currentSubscription.appleProductId}
          </Text>
        </View>
      )}

      {/* Purchase Buttons */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentPalette.tertiary }]}>
          Purchase Products
        </Text>
        {Object.entries(PRODUCT_IDS).map(([key, productId]) => (
          <TouchableOpacity
            key={productId}
            style={[
              styles.button,
              { backgroundColor: currentPalette.quaternary },
            ]}
            onPress={() => handlePurchase(productId)}
            disabled={isLoading}
          >
            <Text
              style={[styles.buttonText, { color: currentPalette.tertiary }]}
            >
              {isLoading ? "Processing..." : `Purchase ${key}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Receipt Management */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentPalette.tertiary }]}>
          Receipt Management
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={handleValidateReceipt}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, { color: currentPalette.tertiary }]}>
            Validate Test Receipt
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={handleRefreshReceipt}
          disabled={isLoading || !currentSubscription}
        >
          <Text style={[styles.buttonText, { color: currentPalette.tertiary }]}>
            Refresh Receipt
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={handleCheckStatus}
          disabled={isLoading || !currentSubscription}
        >
          <Text style={[styles.buttonText, { color: currentPalette.tertiary }]}>
            Check Receipt Status
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={handleCheckActive}
          disabled={isLoading || !currentSubscription}
        >
          <Text style={[styles.buttonText, { color: currentPalette.tertiary }]}>
            Check if Active
          </Text>
        </TouchableOpacity>
      </View>

      {/* Utility Buttons */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentPalette.tertiary }]}>
          Utilities
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: currentPalette.quinary }]}
          onPress={resetState}
        >
          <Text style={[styles.buttonText, { color: currentPalette.primary }]}>
            Reset State
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
  },
  errorText: {
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  errorButton: {
    padding: 8,
  },
  errorButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  subscriptionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subscriptionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AppleIAPExample;
