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
import {
  StripeProvider,
  CardField,
  useStripe,
  useConfirmPayment,
  createToken,
} from "@stripe/stripe-react-native";
import {
  getSubscriptionPlans,
  createSubscription,
  cancelSubscription,
  switchPlan,
  SubscriptionPlan,
} from "../adapters/subscriptionAdapters";

interface LocalSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: (planId: string) => void;
  currentSubscription?: any;
}

const localSubscriptionPlans: LocalSubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Demo",
    price: 0,
    period: "forever",
    features: [
      "5 notes",
      "10 tasks",
      "3 galaxies",
      "5 AI insights per day",
      "Basic features",
    ],
  },
  {
    id: "basic-monthly",
    name: "Basic Monthly",
    price: 9.99,
    period: "month",
    features: [
      "20 notes",
      "30 tasks",
      "10 galaxies",
      "10 AI insights per day",
      "Priority support",
    ],
  },
  {
    id: "basic-annual",
    name: "Basic Annual",
    price: 99.99,
    period: "year",
    features: [
      "20 notes",
      "30 tasks",
      "10 galaxies",
      "10 AI insights per day",
      "Priority support",
      "Save 17%",
    ],
  },
  {
    id: "pro-monthly",
    name: "Pro Monthly",
    price: 19.99,
    period: "month",
    features: [
      "Unlimited notes",
      "Unlimited tasks",
      "Unlimited galaxies",
      "Unlimited AI insights",
      "Advanced features",
      "Priority support",
    ],
  },
  {
    id: "pro-annual",
    name: "Pro Annual",
    price: 199.99,
    period: "year",
    features: [
      "Unlimited notes",
      "Unlimited tasks",
      "Unlimited galaxies",
      "Unlimited AI insights",
      "Advanced features",
      "Priority support",
      "Save 17%",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49.99,
    period: "month",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom integrations",
      "Dedicated support",
      "Advanced analytics",
    ],
  },
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose,
  onUpgrade,
  currentSubscription,
}) => {
  const { currentPalette } = useTheme();
  const { createPaymentMethod } = useStripe();
  const { confirmPayment } = useConfirmPayment();
  const [selectedPlan, setSelectedPlan] = useState<string>("free");
  const [loading, setLoading] = useState(false);
  const [serverPlans, setServerPlans] = useState<SubscriptionPlan[]>([]);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardValidationStatus, setCardValidationStatus] = useState({
    number: false,
    expiry: false,
    cvc: false,
    complete: false,
  });

  // Fetch subscription plans from server
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getSubscriptionPlans();
        setServerPlans(plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  // Helper function to check if plan requires payment
  const requiresPayment = (planId: string) => {
    return planId !== "free" && !planId.includes("free");
  };

  const handleUpgrade = async () => {
    if (selectedPlan === "free") {
      Alert.alert("Free Plan", "You're already on the free plan!");
      return;
    }

    // Map local plan IDs to server plan names
    const planMapping: { [key: string]: string } = {
      free: "Free Tier",
      "basic-monthly": "Basic Monthly",
      "basic-annual": "Basic Annual",
      "pro-monthly": "Pro Monthly",
      "pro-annual": "Pro Annual",
      enterprise: "Enterprise",
    };

    const targetPlanName = planMapping[selectedPlan];
    if (!targetPlanName) {
      Alert.alert("Error", "Invalid plan selection");
      return;
    }

    // Find the corresponding server plan
    const serverPlan = serverPlans.find(
      (plan) => plan.plan_name === targetPlanName
    );

    if (!serverPlan) {
      Alert.alert("Error", "Selected plan not found on server");
      return;
    }

    // If user has an active subscription, offer to switch plans
    if (currentSubscription && currentSubscription.status === "active") {
      // Check if they're selecting a different plan
      if (currentSubscription.plan_name !== targetPlanName) {
        handleSwitchPlan(serverPlan.id, serverPlan.plan_name);
        return;
      } else {
        Alert.alert("Same Plan", "You're already on this plan!");
        return;
      }
    }

    // Only show payment form for paid plans
    if (requiresPayment(selectedPlan)) {
      setShowPaymentForm(true);
    } else {
      // Handle free plan upgrade directly
      try {
        setLoading(true);
        // For free plans, we can upgrade without payment
        onUpgrade(selectedPlan);
        Alert.alert("Success", "Switched to free plan successfully!");
        onClose();
      } catch (error) {
        Alert.alert("Error", "Failed to switch to free plan");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription || currentSubscription.status !== "active") {
      Alert.alert(
        "No Active Subscription",
        "You don't have an active subscription to cancel."
      );
      return;
    }

    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.",
      [
        { text: "Keep Subscription", style: "cancel" },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await cancelSubscription();
              Alert.alert(
                "Success",
                "Your subscription has been canceled. You'll have access until the end of your current billing period."
              );
              onClose();
            } catch (error) {
              console.error("Error canceling subscription:", error);
              Alert.alert(
                "Error",
                "Failed to cancel subscription. Please try again."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSwitchPlan = async (planId: number, planName: string) => {
    if (!currentSubscription || currentSubscription.status !== "active") {
      Alert.alert(
        "No Active Subscription",
        "You need an active subscription to switch plans."
      );
      return;
    }

    Alert.alert(
      "Switch Plan",
      `Are you sure you want to switch to the ${planName} plan? The change will take effect immediately.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch Plan",
          onPress: async () => {
            setLoading(true);
            try {
              const result = await switchPlan(planId);
              Alert.alert(
                "Plan Switch Successful",
                `Switching to ${result.newPlan} on ${new Date(
                  result.effectiveDate
                ).toLocaleDateString()}`
              );
              onClose();
            } catch (error) {
              console.error("Error switching plan:", error);
              Alert.alert("Error", "Failed to switch plan. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handlePayment = async () => {
    // Enhanced card validation
    const validationMessage = getValidationMessage();
    if (validationMessage) {
      Alert.alert("Error", validationMessage);
      return;
    }

    // Validate card is complete
    if (!cardValidationStatus.complete) {
      Alert.alert("Error", "Please enter complete card information");
      return;
    }

    setLoading(true);
    try {
      // Map local plan IDs to server plan names
      const planMapping: { [key: string]: string } = {
        free: "Free Tier",
        "basic-monthly": "Basic Monthly",
        "basic-annual": "Basic Annual",
        "pro-monthly": "Pro Monthly",
        "pro-annual": "Pro Annual",
        enterprise: "Enterprise",
      };

      const targetPlanName = planMapping[selectedPlan];
      if (!targetPlanName) {
        throw new Error("Invalid plan selection");
      }

      // Find the corresponding server plan
      const serverPlan = serverPlans.find(
        (plan) => plan.plan_name === targetPlanName
      );

      if (!serverPlan) {
        throw new Error("Selected plan not found on server");
      }

      // Create payment method from card details
      const { paymentMethod, error: paymentMethodError } =
        await createPaymentMethod({
          paymentMethodType: "Card",
        });

      if (paymentMethodError) {
        throw new Error(
          paymentMethodError.message || "Failed to create payment method"
        );
      }

      if (!paymentMethod?.id) {
        throw new Error("Failed to create payment method");
      }

      // Create subscription with the real payment method
      const result = await createSubscription(serverPlan.id, paymentMethod.id);

      // Handle payment confirmation if needed (for 3D Secure, etc.)
      if (result.clientSecret) {
        const { error: confirmError } = await confirmPayment(
          result.clientSecret,
          {
            paymentMethodType: "Card",
          }
        );

        if (confirmError) {
          // Handle specific error types
          if (confirmError.code === "Canceled") {
            Alert.alert("Payment Cancelled", "Payment was cancelled by user");
            return;
          }
          throw new Error(
            confirmError.message || "Payment confirmation failed"
          );
        }
      }

      Alert.alert(
        "Success! 🎉",
        `Welcome to ${targetPlanName}! Your subscription is now active and you have access to all premium features.`,
        [
          {
            text: "Continue",
            onPress: () => {
              onUpgrade(selectedPlan);
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process payment. Please try again.";
      Alert.alert("Payment Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, period: string) => {
    if (price === 0) return "Free";
    if (period === "year") return `$${price}/year`;
    if (period === "month") return `$${price}/month`;
    if (period === "forever") return "Free";
    return `$${price}/${period}`;
  };

  const getValidationMessage = () => {
    if (!cardDetails) return "Please enter your card details";
    if (!cardDetails.complete) return "Please complete all card details";
    if (cardDetails.error)
      return cardDetails.error.message || "Invalid card details";
    if (!cardValidationStatus.number) return "Please enter a valid card number";
    if (!cardValidationStatus.expiry) return "Please enter a valid expiry date";
    if (!cardValidationStatus.cvc) return "Please enter a valid CVC";
    return null; // All valid
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={currentPalette.tertiary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: currentPalette.tertiary }]}>
            Choose Your Plan
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.subtitle, { color: currentPalette.quinary }]}>
            Unlock the full potential of Renaissance
          </Text>

          {/* Current Subscription Status */}
          {currentSubscription && (
            <View
              style={[
                styles.currentSubscriptionCard,
                { backgroundColor: currentPalette.card },
              ]}
            >
              <View style={styles.currentSubscriptionHeader}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={currentPalette.quaternary}
                />
                <Text
                  style={[
                    styles.currentSubscriptionTitle,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  Current Subscription
                </Text>
              </View>
              <Text
                style={[
                  styles.currentSubscriptionPlan,
                  { color: currentPalette.quaternary },
                ]}
              >
                {currentSubscription.plan_name}
              </Text>
              <Text
                style={[
                  styles.currentSubscriptionStatus,
                  { color: currentPalette.quinary },
                ]}
              >
                Status: {currentSubscription.status}
              </Text>
              {currentSubscription.status === "active" && (
                <Text
                  style={[
                    styles.currentSubscriptionDate,
                    { color: currentPalette.quinary },
                  ]}
                >
                  Next billing:{" "}
                  {new Date(currentSubscription.end_date).toLocaleDateString()}
                </Text>
              )}
              {currentSubscription.status === "canceled" && (
                <Text
                  style={[styles.currentSubscriptionDate, { color: "#ff4444" }]}
                >
                  Access until:{" "}
                  {new Date(currentSubscription.end_date).toLocaleDateString()}
                </Text>
              )}
              {currentSubscription.status === "active" && (
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: "#ff4444" }]}
                  onPress={handleCancelSubscription}
                  disabled={loading}
                >
                  <Ionicons name="close-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.cancelButtonText}>
                    Cancel Subscription
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Plans */}
          <View style={styles.plansContainer}>
            {localSubscriptionPlans.map((plan: LocalSubscriptionPlan) => {
              const isSelected = selectedPlan === plan.id;
              const isPopular = plan.popular;

              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    { backgroundColor: currentPalette.card },
                    isSelected && [
                      styles.selectedPlanCard,
                      { borderColor: currentPalette.quaternary },
                    ],
                    isPopular && [
                      styles.popularPlanCard,
                      { borderColor: currentPalette.quaternary },
                    ],
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  {isPopular && (
                    <View
                      style={[
                        styles.popularBadge,
                        { backgroundColor: currentPalette.quaternary },
                      ]}
                    >
                      <Ionicons name="star" size={12} color="#FFFFFF" />
                      <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                  )}

                  <View style={styles.planHeader}>
                    <Text
                      style={[
                        styles.planName,
                        { color: currentPalette.tertiary },
                      ]}
                    >
                      {plan.name}
                    </Text>
                    <Text
                      style={[
                        styles.planPrice,
                        { color: currentPalette.quaternary },
                      ]}
                    >
                      {formatPrice(plan.price, plan.period)}
                    </Text>
                  </View>

                  <View style={styles.featuresList}>
                    {plan.features.map((feature: string, index: number) => (
                      <View key={index} style={styles.featureItem}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={currentPalette.quaternary}
                        />
                        <Text
                          style={[
                            styles.featureText,
                            { color: currentPalette.tertiary },
                          ]}
                        >
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {isSelected && (
                    <View
                      style={[
                        styles.selectionIndicator,
                        { backgroundColor: currentPalette.quaternary },
                      ]}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Feature in Development Message */}
          <View
            style={[
              styles.developmentMessage,
              { backgroundColor: currentPalette.card },
            ]}
          >
            <Ionicons
              name="construct"
              size={20}
              color={currentPalette.quaternary}
            />
            <Text
              style={[
                styles.developmentText,
                { color: currentPalette.quaternary },
              ]}
            >
              Feature in Development
            </Text>
          </View>

          {/* Upgrade Button */}
          {showPaymentForm ? (
            <View style={styles.paymentForm}>
              <Text
                style={[
                  styles.paymentTitle,
                  { color: currentPalette.tertiary },
                ]}
              >
                Enter Payment Details
              </Text>
              <CardField
                postalCodeEnabled={false}
                placeholders={{
                  number: "4242 4242 4242 4242",
                }}
                cardStyle={{
                  backgroundColor: currentPalette.card,
                  textColor: currentPalette.tertiary,
                  borderRadius: 8,
                }}
                style={styles.cardField}
                onCardChange={(cardDetails) => {
                  setCardDetails(cardDetails);
                  setCardValidationStatus({
                    number: cardDetails?.validNumber === "Valid",
                    expiry: cardDetails?.validExpiryDate === "Valid",
                    cvc: cardDetails?.validCVC === "Valid",
                    complete: cardDetails?.complete || false,
                  });
                }}
              />

              {/* Card Validation Status */}
              <View style={styles.validationStatus}>
                <View style={styles.validationItem}>
                  <Ionicons
                    name={
                      cardValidationStatus.number
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      cardValidationStatus.number
                        ? currentPalette.quaternary
                        : currentPalette.quinary
                    }
                  />
                  <Text
                    style={[
                      styles.validationText,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Card Number
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  <Ionicons
                    name={
                      cardValidationStatus.expiry
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      cardValidationStatus.expiry
                        ? currentPalette.quaternary
                        : currentPalette.quinary
                    }
                  />
                  <Text
                    style={[
                      styles.validationText,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Expiry Date
                  </Text>
                </View>
                <View style={styles.validationItem}>
                  <Ionicons
                    name={
                      cardValidationStatus.cvc
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      cardValidationStatus.cvc
                        ? currentPalette.quaternary
                        : currentPalette.quinary
                    }
                  />
                  <Text
                    style={[
                      styles.validationText,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    CVC
                  </Text>
                </View>
              </View>

              <View style={styles.paymentButtons}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { borderColor: currentPalette.quinary },
                  ]}
                  onPress={() => setShowPaymentForm(false)}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.payButton,
                    {
                      backgroundColor:
                        cardValidationStatus.complete && !loading
                          ? currentPalette.quaternary
                          : currentPalette.quinary,
                    },
                    (!cardValidationStatus.complete || loading) &&
                      styles.disabledButton,
                  ]}
                  disabled={!cardValidationStatus.complete || loading}
                  onPress={handlePayment}
                >
                  {loading ? (
                    <ActivityIndicator color={currentPalette.tertiary} />
                  ) : (
                    <Text
                      style={[
                        styles.payButtonText,
                        { color: currentPalette.tertiary },
                      ]}
                    >
                      Pay Now
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.upgradeButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              disabled={loading}
              onPress={handleUpgrade}
            >
              {loading ? (
                <ActivityIndicator color={currentPalette.tertiary} />
              ) : (
                <>
                  <Ionicons
                    name="diamond"
                    size={20}
                    color={currentPalette.tertiary}
                  />
                  <Text
                    style={[
                      styles.upgradeButtonText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    {selectedPlan === "free"
                      ? "Stay on Free Plan"
                      : "Upgrade Now"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <Text style={[styles.disclaimer, { color: currentPalette.quinary }]}>
            You can change or cancel your subscription anytime from your account
            settings.
          </Text>
        </ScrollView>
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
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  currentSubscriptionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  currentSubscriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  currentSubscriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  currentSubscriptionPlan: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  currentSubscriptionStatus: {
    fontSize: 14,
    marginBottom: 4,
  },
  currentSubscriptionDate: {
    fontSize: 14,
    marginBottom: 12,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 30,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  selectedPlanCard: {
    borderColor: "#4CAF50",
    transform: [{ scale: 1.02 }],
  },
  popularPlanCard: {
    borderColor: "#FFD700",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "600",
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  selectionIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  paymentForm: {
    marginTop: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  cardField: {
    height: 50,
    marginBottom: 20,
  },
  paymentButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  payButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  validationStatus: {
    marginBottom: 20,
    gap: 8,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  validationText: {
    fontSize: 14,
  },
  developmentMessage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  developmentText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
