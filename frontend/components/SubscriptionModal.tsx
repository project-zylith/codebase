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

interface SubscriptionPlan {
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

const subscriptionPlans: SubscriptionPlan[] = [
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

  const handleUpgrade = async () => {
    if (selectedPlan === "free") {
      Alert.alert("Free Plan", "You're already on the free plan!");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUpgrade(selectedPlan);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to upgrade subscription");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, period: string) => {
    if (price === 0) return "Free";
    return `$${price}/${period}`;
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
            {subscriptionPlans.map((plan) => {
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
                    {plan.features.map((feature, index) => (
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
              <ActivityIndicator size="small" color={currentPalette.tertiary} />
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
});
