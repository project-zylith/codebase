import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import AuthLogin from "./AuthLogin";
import AuthSignUp from "./AuthSignUp";
import { SubscriptionModal } from "./SubscriptionModal";
import {
  getUserSubscription,
  resubscribe,
  switchPlan,
} from "../adapters/subscriptionAdapters";

const { width } = Dimensions.get("window");

export const AccountScreen = () => {
  const { state: userState, logout } = useUser();
  const { currentPalette, currentPaletteId, paletteOptions, switchPalette } =
    useTheme();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState(currentPaletteId);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  const fetchSubscription = async () => {
    if (userState.isAuthenticated) {
      setLoadingSubscription(true);
      try {
        const result = await getUserSubscription();
        setSubscription(result.subscription);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoadingSubscription(false);
      }
    }
  };

  useEffect(() => {
    console.log("AccountScreen: userState changed", userState);
  }, [userState]);

  // Fetch user subscription when authenticated
  useEffect(() => {
    fetchSubscription();
  }, [userState.isAuthenticated]);

  useEffect(() => {
    setSelectedPaletteId(currentPaletteId);
  }, [currentPaletteId]);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };

  const handlePaletteChange = async (paletteId: string) => {
    try {
      setSelectedPaletteId(paletteId);

      // Animate the selection
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      await switchPalette(paletteId);
    } catch (error) {
      console.error("Error switching palette:", error);
      Alert.alert("Error", "Failed to switch color palette");
      setSelectedPaletteId(currentPaletteId);
    }
  };

  const handleUpgradeSubscription = (planId: string) => {
    // Refresh subscription data after successful upgrade
    fetchSubscription();
    Alert.alert(
      "Success! 🎉",
      `Your subscription has been updated! You now have access to all the features of your new plan.`,
      [{ text: "OK" }]
    );
  };

  const handleResubscribe = async () => {
    try {
      await resubscribe();
      Alert.alert("Success", "Your subscription has been reactivated!");
      fetchSubscription(); // Refresh subscription data
    } catch (error) {
      console.error("Error resubscribing:", error);
      Alert.alert(
        "Error",
        "Failed to reactivate subscription. Please try again."
      );
    }
  };

  const handleSwitchPlan = async (planId: number, planName: string) => {
    try {
      const result = await switchPlan(planId);
      Alert.alert(
        "Plan Switch Successful",
        `Switching to ${result.newPlan} on ${new Date(
          result.effectiveDate
        ).toLocaleDateString()}`
      );
      fetchSubscription(); // Refresh subscription data
    } catch (error) {
      console.error("Error switching plan:", error);
      Alert.alert("Error", "Failed to switch plan. Please try again.");
    }
  };

  const renderSubscriptionSection = () => (
    <View
      style={[
        styles.subscriptionSection,
        { backgroundColor: currentPalette.card },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Ionicons name="diamond" size={24} color={currentPalette.quaternary} />
        <Text style={[styles.sectionTitle, { color: currentPalette.tertiary }]}>
          Subscription
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchSubscription}
          disabled={loadingSubscription}
        >
          <Ionicons
            name="refresh"
            size={20}
            color={
              loadingSubscription
                ? currentPalette.quinary
                : currentPalette.quaternary
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.subscriptionContent}>
        <View style={styles.subscriptionInfo}>
          {loadingSubscription ? (
            <Text
              style={[
                styles.subscriptionStatus,
                { color: currentPalette.quinary },
              ]}
            >
              Loading...
            </Text>
          ) : subscription ? (
            <>
              <Text
                style={[
                  styles.subscriptionStatus,
                  { color: currentPalette.quaternary },
                ]}
              >
                {subscription.plan_name}
              </Text>
              <Text
                style={[
                  styles.subscriptionDescription,
                  { color: currentPalette.quinary },
                ]}
              >
                {subscription.description}
              </Text>

              <View style={styles.subscriptionDetails}>
                <Text
                  style={[
                    styles.subscriptionDetail,
                    { color: currentPalette.quinary },
                  ]}
                >
                  Status: {subscription.status}
                </Text>
                <Text
                  style={[
                    styles.subscriptionDetail,
                    { color: currentPalette.quinary },
                  ]}
                >
                  Price: ${subscription.price}/month
                </Text>
                <Text
                  style={[
                    styles.subscriptionDetail,
                    { color: currentPalette.quinary },
                  ]}
                >
                  Started:{" "}
                  {new Date(subscription.start_date).toLocaleDateString()}
                </Text>
                {subscription.end_date && (
                  <Text
                    style={[
                      styles.subscriptionDetail,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    {subscription.status === "canceled"
                      ? "Access until"
                      : "Next billing"}
                    : {new Date(subscription.end_date).toLocaleDateString()}
                  </Text>
                )}
                {subscription.status === "canceled" && (
                  <Text
                    style={[
                      styles.subscriptionChangeNotice,
                      { color: currentPalette.quaternary },
                    ]}
                  >
                    ⚠️ You can reactivate your subscription before this date
                  </Text>
                )}
              </View>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.subscriptionStatus,
                  { color: currentPalette.quaternary },
                ]}
              >
                Free Demo
              </Text>
              <Text
                style={[
                  styles.subscriptionDescription,
                  { color: currentPalette.quinary },
                ]}
              >
                Basic features with limited usage
              </Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.upgradeButton,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={() => {
            if (subscription && subscription.status === "canceled") {
              // Check if subscription period has ended
              const endDate = new Date(subscription.end_date);
              if (endDate < new Date()) {
                Alert.alert(
                  "Subscription Expired",
                  "Your subscription period has ended. Please create a new subscription.",
                  [{ text: "OK" }]
                );
                return;
              }
              // Show resubscribe confirmation
              Alert.alert(
                "Reactivate Subscription",
                "Would you like to reactivate your subscription? You'll continue with the same plan and billing cycle.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Reactivate",
                    onPress: handleResubscribe,
                  },
                ]
              );
            } else {
              setShowSubscriptionModal(true);
            }
          }}
        >
          <Ionicons name="arrow-up" size={16} color={currentPalette.tertiary} />
          <Text
            style={[
              styles.upgradeButtonText,
              { color: currentPalette.tertiary },
            ]}
          >
            {subscription && subscription.status === "canceled"
              ? "Reactivate"
              : "Upgrade"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStylishPaletteSelector = () => (
    <View
      style={[styles.paletteSection, { backgroundColor: currentPalette.card }]}
    >
      <View style={styles.sectionHeader}>
        <Ionicons
          name="color-palette"
          size={24}
          color={currentPalette.quaternary}
        />
        <Text style={[styles.sectionTitle, { color: currentPalette.tertiary }]}>
          Choose Your Theme
        </Text>
      </View>

      <Text style={[styles.sectionSubtitle, { color: currentPalette.quinary }]}>
        Personalize your Renaissance experience
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.paletteContainer}
        contentContainerStyle={styles.paletteContent}
      >
        {paletteOptions.map((option) => {
          const isSelected = selectedPaletteId === option.id;
          const palette = option.palette;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.paletteCard,
                { backgroundColor: palette.card },
                isSelected && [
                  styles.selectedPaletteCard,
                  { borderColor: palette.quaternary },
                ],
              ]}
              onPress={() => handlePaletteChange(option.id)}
            >
              <Animated.View
                style={[
                  styles.paletteCardContent,
                  isSelected && { transform: [{ scale: scaleAnim }] },
                ]}
              >
                {/* Color Preview */}
                <View style={styles.colorPreview}>
                  <View
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: palette.primary },
                    ]}
                  />
                  <View
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: palette.secondary },
                    ]}
                  />
                  <View
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: palette.tertiary },
                    ]}
                  />
                  <View
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: palette.quaternary },
                    ]}
                  />
                </View>

                {/* Palette Name */}
                <Text style={[styles.paletteName, { color: palette.tertiary }]}>
                  {option.name}
                </Text>

                {/* Selection Indicator */}
                {isSelected && (
                  <View
                    style={[
                      styles.selectionIndicator,
                      { backgroundColor: palette.quaternary },
                    ]}
                  >
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderUserInfo = () => {
    if (!userState.user) return null;

    return (
      <ScrollView
        style={[styles.content, { backgroundColor: currentPalette.primary }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: currentPalette.quaternary },
            ]}
          >
            <Text
              style={[styles.avatarText, { color: currentPalette.tertiary }]}
            >
              {userState.user.username.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.username, { color: currentPalette.tertiary }]}>
            {userState.user.username}
          </Text>

          <Text style={[styles.email, { color: currentPalette.quinary }]}>
            {userState.user.email}
          </Text>
        </View>

        {/* Theme Selector */}
        {renderStylishPaletteSelector()}

        {/* Subscription Section */}
        {renderSubscriptionSection()}

        {/* Account Actions */}
        <View
          style={[
            styles.actionsSection,
            { backgroundColor: currentPalette.card },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="settings"
              size={24}
              color={currentPalette.quaternary}
            />
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Account Settings
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: currentPalette.button },
            ]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out"
              size={20}
              color={currentPalette.buttonText}
            />
            <Text
              style={[
                styles.actionButtonText,
                { color: currentPalette.buttonText },
              ]}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  if (userState.isLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
      >
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: currentPalette.primary },
          ]}
        >
          <Ionicons
            name="refresh"
            size={32}
            color={currentPalette.quaternary}
          />
          <Text
            style={[styles.loadingText, { color: currentPalette.tertiary }]}
          >
            Loading your account...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: currentPalette.primary }]}
    >
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {userState.user ? (
          renderUserInfo()
        ) : (
          <View style={styles.authContainer}>
            {showSignUp ? <AuthSignUp /> : <AuthLogin />}
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setShowSignUp(!showSignUp)}
            >
              <Text
                style={[
                  styles.switchText,
                  { color: currentPalette.quaternary },
                ]}
              >
                {showSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onUpgrade={handleUpgradeSubscription}
        currentSubscription={subscription}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 36,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  subscriptionSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  subscriptionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionStatus: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subscriptionDescription: {
    fontSize: 14,
  },
  subscriptionDetails: {
    marginTop: 8,
  },
  subscriptionDetail: {
    fontSize: 12,
    marginBottom: 2,
  },
  subscriptionChangeNotice: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    fontStyle: "italic",
  },
  subscriptionActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 15,
    gap: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
    color: "#FFFFFF",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  paletteSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    flex: 1,
  },
  refreshButton: {
    padding: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  paletteContainer: {
    flexDirection: "row",
  },
  paletteContent: {
    paddingHorizontal: 10,
  },
  paletteCard: {
    width: width * 0.4,
    height: 120,
    borderRadius: 16,
    marginHorizontal: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPaletteCard: {
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  paletteCardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  colorPreview: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  paletteName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  selectionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsSection: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 15,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
  },
  authContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  switchButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  switchText: {
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
