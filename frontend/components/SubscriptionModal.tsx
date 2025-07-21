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
}

const localSubscriptionPlans: LocalSubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "20 notes",
      "10 tasks",
      "3 galaxies",
      "5 AI insights per day",
      "Basic features",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    period: "month",
    features: [
      "100 notes",
      "50 tasks",
      "10 galaxies",
      "20 AI insights per day",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
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
}) => {
  const { currentPalette } = useTheme();
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

  const handleUpgrade = async () => {
    if (selectedPlan === "free") {
      Alert.alert("Free Plan", "You're already on the free plan!");
      return;
    }

    // Find the corresponding server plan
    const serverPlan = serverPlans.find((plan) =>
      plan.plan_name.toLowerCase().includes(selectedPlan)
    );

    if (!serverPlan) {
      Alert.alert("Error", "Selected plan not found on server");
      return;
    }

    setShowPaymentForm(true);
  };

  const handlePayment = async () => {
    // Enhanced card validation
    const validationMessage = getValidationMessage();
    if (validationMessage) {
      Alert.alert("Error", validationMessage);
      return;
    }

    setLoading(true);
    try {
      // Find the corresponding server plan
      const serverPlan = serverPlans.find((plan) =>
        plan.plan_name.toLowerCase().includes(selectedPlan)
      );

      if (!serverPlan) {
        throw new Error("Selected plan not found on server");
      }

      // For now, let's use a test payment method ID since we need to implement
      // proper payment method creation. This will work for testing.
      const testPaymentMethodId = "pm_card_visa"; // Stripe test payment method

      // Create subscription with Stripe using the test payment method
      const result = await createSubscription(
        serverPlan.id,
        testPaymentMethodId
      );

      Alert.alert("Success", "Subscription created successfully!");
      onUpgrade(selectedPlan);
      onClose();
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
                      backgroundColor: getValidationMessage()
                        ? currentPalette.quinary
                        : currentPalette.quaternary,
                    },
                    loading && styles.disabledButton,
                  ]}
                  onPress={handlePayment}
                  disabled={loading || !!getValidationMessage()}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={currentPalette.tertiary}
                    />
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
                loading && styles.disabledButton,
              ]}
              onPress={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={currentPalette.tertiary}
                />
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
});
