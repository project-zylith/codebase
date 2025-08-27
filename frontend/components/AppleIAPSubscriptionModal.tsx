import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import {
  iapService,
  SUBSCRIPTION_PLANS,
  ProductId,
} from "../services/iapService";
import { Product } from "react-native-iap";
import { useAppleIAP } from "../hooks/useAppleIAP";

interface AppleIAPSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: (planId: string) => void;
  currentSubscription?: any;
  userToken?: string;
  userId?: number;
}

export const AppleIAPSubscriptionModal: React.FC<
  AppleIAPSubscriptionModalProps
> = ({
  visible,
  onClose,
  onUpgrade,
  currentSubscription,
  userToken,
  userId,
}) => {
  const { currentPalette } = useTheme();
  const { refreshSubscription } = useSubscription();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Use the new Apple IAP hook
  const {
    isLoading: purchaseLoading,
    error: purchaseError,
    currentSubscription: validatedSubscription,
    purchaseProduct,
    clearError,
    resetState,
  } = useAppleIAP();

  // Track which plan is currently being purchased
  const [purchasingPlanId, setPurchasingPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      initializeIAP();
    }
  }, [visible]);

  const initializeIAP = async () => {
    try {
      setLoading(true);

      // Get products from App Store using the service
      const fetchedProducts = await iapService.getProducts();
      setProducts(fetchedProducts);
    } catch (error: any) {
      console.error("Failed to initialize IAP:", error);

      let errorMessage = "Failed to load subscription plans. Please try again.";

      if (error.message && error.message.includes("IAP not available")) {
        errorMessage =
          "IAP not available. Please test on a real device with TestFlight.";
      }

      Alert.alert("IAP Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: any) => {
    if (!userToken) {
      Alert.alert(
        "Authentication Required",
        "Please log in to purchase a subscription."
      );
      return;
    }

    try {
      setPurchasingPlanId(plan.id);
      clearError();

      console.log("🛒 Starting purchase for:", plan.name);

      // Use the new Apple IAP hook with backend validation
      await purchaseProduct(plan.productId, userToken, userId);

      // Success! The hook will handle the subscription state
      Alert.alert(
        "Subscription Successful!",
        `You've successfully subscribed to ${plan.name}. Your receipt has been validated with our servers.`,
        [
          {
            text: "OK",
            onPress: async () => {
              // Refresh the subscription state
              await refreshSubscription();
              onUpgrade(plan.id);
              onClose();
              resetState();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Purchase failed:", error);

      let errorMessage = "Purchase failed. Please try again.";

      if (error.code) {
        switch (error.code) {
          case "E_ALREADY_OWNED":
            errorMessage = "You already have an active subscription.";
            break;
          case "E_USER_CANCELLED":
            errorMessage = "Purchase was cancelled.";
            break;
          case "E_ITEM_UNAVAILABLE":
            errorMessage = "This subscription plan is currently unavailable.";
            break;
          default:
            errorMessage = `Purchase failed: ${error.message}`;
        }
      }

      Alert.alert("Purchase Failed", errorMessage);
    } finally {
      setPurchasingPlanId(null);
    }
  };

  const renderPlanCard = (plan: any) => {
    const isCurrentPlan = currentSubscription?.plan_id === plan.id;
    const isLoading = purchasingPlanId === plan.id;
    const isAnnual = plan.period === "/year";

    return (
      <View
        key={plan.id}
        style={[
          styles.planCard,
          {
            backgroundColor: currentPalette.card,
            borderColor: isCurrentPlan
              ? currentPalette.quaternary
              : isAnnual
              ? currentPalette.quaternary + "40"
              : currentPalette.quinary + "20",
            borderWidth: isCurrentPlan ? 2 : isAnnual ? 2 : 1,
          },
        ]}
      >
        {/* Plan Header */}
        <View style={styles.planHeader}>
          <View style={styles.planNameRow}>
            <Text style={[styles.planName, { color: currentPalette.tertiary }]}>
              {plan.name}
            </Text>
            {isAnnual && (
              <View
                style={[
                  styles.annualBadge,
                  { backgroundColor: currentPalette.quaternary },
                ]}
              >
                <Text
                  style={[
                    styles.annualBadgeText,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  BEST VALUE
                </Text>
              </View>
            )}
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: currentPalette.tertiary }]}>
              {plan.price}
            </Text>
            <Text style={[styles.period, { color: currentPalette.quinary }]}>
              {plan.period}
            </Text>
          </View>
        </View>

        {/* Plan Features */}
        <View style={styles.featuresContainer}>
          {plan.features.map((feature: string, index: number) => {
            const [iconName, ...featureTextParts] = feature.split(" ");
            const featureText = featureTextParts.join(" ");

            return (
              <View key={index} style={styles.featureRow}>
                <Ionicons
                  name={iconName as any}
                  size={16}
                  color={currentPalette.quaternary}
                  style={styles.featureIcon}
                />
                <Text
                  style={[
                    styles.featureText,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  {featureText}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            {
              backgroundColor: isCurrentPlan
                ? currentPalette.quinary
                : currentPalette.quaternary,
            },
          ]}
          onPress={() => handleSubscribe(plan)}
          disabled={isCurrentPlan || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={currentPalette.tertiary} />
          ) : (
            <Text
              style={[
                styles.subscribeButtonText,
                { color: currentPalette.tertiary },
              ]}
            >
              {isCurrentPlan ? "Current Plan" : "Subscribe"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: currentPalette.primary },
          ]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={currentPalette.quaternary} />
            <Text
              style={[styles.loadingText, { color: currentPalette.tertiary }]}
            >
              Loading subscription plans...
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={currentPalette.tertiary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: currentPalette.tertiary }]}
          >
            Choose Your Plan
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* App Icon and Name */}
        <View style={styles.appInfo}>
          <View
            style={[
              styles.appIcon,
              { backgroundColor: currentPalette.quaternary },
            ]}
          >
            <Ionicons name="planet" size={32} color={currentPalette.tertiary} />
          </View>
          <Text style={[styles.appName, { color: currentPalette.tertiary }]}>
            REN|AI
          </Text>
        </View>

        {/* Error Display */}
        {purchaseError && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: currentPalette.quinary + "20" },
            ]}
          >
            <Text style={[styles.errorText, { color: currentPalette.quinary }]}>
              {purchaseError}
            </Text>
            <TouchableOpacity
              onPress={clearError}
              style={styles.errorCloseButton}
            >
              <Ionicons name="close" size={16} color={currentPalette.quinary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Subscription Plans */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {SUBSCRIPTION_PLANS.map(renderPlanCard)}
        </ScrollView>

        {/* Plan Switching Info for Existing Subscribers */}
        {currentSubscription && (
          <View style={styles.switchingInfo}>
            <Text
              style={[
                styles.switchingTitle,
                { color: currentPalette.tertiary },
              ]}
            >
              Want to change your plan?
            </Text>
            <Text
              style={[styles.switchingText, { color: currentPalette.quinary }]}
            >
              You can upgrade, downgrade, or switch between monthly and annual
              billing. Changes take effect at your next billing cycle.
            </Text>
            <Text
              style={[styles.switchingNote, { color: currentPalette.quinary }]}
            >
              💡 Tip: Annual plans save you 17% compared to monthly billing!
            </Text>
          </View>
        )}

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: currentPalette.quinary }]}>
            Subscriptions automatically renew unless auto-renew is turned off at
            least 24 hours before the end of the current period.
          </Text>
          <Text style={[styles.footerText, { color: currentPalette.quinary }]}>
            You can manage and cancel your subscriptions by going to your App
            Store account settings after purchase.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 24,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  planCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 3,
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  planHeader: {
    marginBottom: 12,
  },
  planNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  planName: {
    fontSize: 22,
    fontWeight: "800",
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  annualBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  annualBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  price: {
    fontSize: 32,
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 20,
    paddingVertical: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  subscribeButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 8,
  },
  switchingInfo: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  switchingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  switchingText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
  },
  switchingNote: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
  },
  errorText: {
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  errorCloseButton: {
    padding: 4,
  },
});

export default AppleIAPSubscriptionModal;
