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
import { useSubscription } from "../contexts/SubscriptionContext";
import AuthLogin from "./AuthLogin";
import AuthSignUp from "./AuthSignUp";
import { AppleIAPSubscriptionModal } from "./AppleIAPSubscriptionModal";
import UserProfileUpdateModal from "./UserProfileUpdateModal";
import { getToken } from "../adapters/userAdapters";
import { cancelSubscription } from "../adapters/subscriptionAdapters";

const { width } = Dimensions.get("window");

export const AccountScreen = () => {
  const { state: userState, logout } = useUser();
  const { currentPalette, currentPaletteId, paletteOptions, switchPalette } =
    useTheme();
  const { state: subscriptionState, setOpenSubscriptionModalHandler } =
    useSubscription();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState(currentPaletteId);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [userToken, setUserToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log("AccountScreen: userState changed", userState);
  }, [userState]);

  useEffect(() => {
    setSelectedPaletteId(currentPaletteId);
  }, [currentPaletteId]);

  // Connect the subscription modal handler to the context
  useEffect(() => {
    setOpenSubscriptionModalHandler(() => () => setShowSubscriptionModal(true));
  }, [setOpenSubscriptionModalHandler]);

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
    Alert.alert(
      "Success! 🎉",
      `Your subscription has been updated! You now have access to all the features of your new plan.`,
      [{ text: "OK" }]
    );
  };

  const handleCancelSubscription = async () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription? Changes take effect immediately.",
      [
        {
          text: "Keep Subscription",
          style: "cancel",
        },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelSubscription();
              Alert.alert(
                "Subscription Canceled",
                "Your subscription has been canceled. Changes take effect immediately.",
                [{ text: "OK" }]
              );
              // Refresh subscription state
              // The subscription context should handle this automatically
            } catch (error: any) {
              console.error("Error canceling subscription:", error);
              Alert.alert(
                "Error",
                error.message ||
                  "Failed to cancel subscription. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleOpenSubscriptionModal = async () => {
    if (userState.user) {
      const token = await getToken();
      setUserToken(token || undefined);
      setShowSubscriptionModal(true);
    } else {
      Alert.alert(
        "Authentication Required",
        "Please log in to view subscription options."
      );
    }
  };

  const renderSubscriptionSection = () => {
    if (subscriptionState.isLoading) {
      return (
        <View
          style={[
            styles.subscriptionSection,
            { backgroundColor: currentPalette.card },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="diamond"
              size={24}
              color={currentPalette.quaternary}
            />
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Subscription
            </Text>
          </View>
          <View style={styles.subscriptionContent}>
            <Text
              style={[
                styles.subscriptionDescription,
                { color: currentPalette.quinary },
              ]}
            >
              Loading subscription status...
            </Text>
          </View>
        </View>
      );
    }

    const subscription = subscriptionState.subscription;
    const isActive = subscription && subscription.status === "active";
    const isCanceled = subscription && subscription.status === "canceled";
    const hasSubscription =
      subscription &&
      (subscription.status === "active" || subscription.status === "canceled");
    const planName = subscription?.plan_name || "Free Demo";

    let description = "Basic features with limited usage";
    if (isActive) {
      description = `Active ${planName} subscription`;
    } else if (isCanceled) {
      description = `Your ${planName} subscription has been canceled.`;
    }

    return (
      <View
        style={[
          styles.subscriptionSection,
          { backgroundColor: currentPalette.card },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons
            name="diamond"
            size={24}
            color={currentPalette.quaternary}
          />
          <Text
            style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
          >
            Subscription
          </Text>
        </View>

        <View style={styles.subscriptionContent}>
          <View style={styles.subscriptionInfo}>
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.subscriptionStatus,
                  { color: currentPalette.quaternary },
                ]}
              >
                {planName}
              </Text>
              {isCanceled && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: currentPalette.quinary + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Canceled
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.subscriptionDescription,
                { color: currentPalette.quinary },
              ]}
            >
              {description}
            </Text>

            {/* Subscription Details */}
            {hasSubscription && subscription && (
              <View style={styles.subscriptionDetails}>
                <View style={styles.detailRow}>
                  <Ionicons
                    name="calendar"
                    size={14}
                    color={currentPalette.quinary}
                  />
                  <Text
                    style={[
                      styles.detailText,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Started:{" "}
                    {new Date(subscription.start_date).toLocaleDateString()}
                  </Text>
                </View>

                {subscription.end_date && (
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="time"
                      size={14}
                      color={currentPalette.quinary}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: currentPalette.quinary },
                      ]}
                    >
                      {isCanceled ? "Access until: " : "Next billing: "}
                      {new Date(subscription.end_date).toLocaleDateString()}
                    </Text>
                  </View>
                )}

                {/* Payment Method Info */}
                <View style={styles.detailRow}>
                  <Ionicons
                    name="card"
                    size={14}
                    color={currentPalette.quinary}
                  />
                  <Text
                    style={[
                      styles.detailText,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Billed through Apple App Store
                  </Text>
                </View>

                {/* Disclaimer for canceled subscriptions */}
                {isCanceled && (
                  <View style={styles.disclaimerContainer}>
                    <Ionicons
                      name="information-circle"
                      size={14}
                      color={currentPalette.quaternary}
                    />
                    <Text
                      style={[
                        styles.disclaimerText,
                        { color: currentPalette.quaternary },
                      ]}
                    >
                      Changes to your subscription take effect immediately
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {!hasSubscription ? (
            <TouchableOpacity
              style={[
                styles.upgradeButton,
                { backgroundColor: currentPalette.quaternary },
              ]}
              onPress={handleOpenSubscriptionModal}
            >
              <Ionicons
                name="arrow-up"
                size={16}
                color={currentPalette.tertiary}
              />
              <Text
                style={[
                  styles.upgradeButtonText,
                  { color: currentPalette.tertiary },
                ]}
              >
                Upgrade
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.subscriptionActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: currentPalette.button },
                ]}
                onPress={handleOpenSubscriptionModal}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={16}
                  color={currentPalette.buttonText}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: currentPalette.buttonText },
                  ]}
                >
                  Change Plan
                </Text>
              </TouchableOpacity>

              {isActive && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: currentPalette.quinary + "20" },
                  ]}
                  onPress={handleCancelSubscription}
                >
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={currentPalette.quinary}
                  />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: currentPalette.quinary },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

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
        Personalize your REN|AI experience
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
            onPress={() => setShowProfileUpdateModal(true)}
          >
            <Ionicons
              name="person"
              size={20}
              color={currentPalette.buttonText}
            />
            <Text
              style={[
                styles.actionButtonText,
                { color: currentPalette.buttonText },
              ]}
            >
              Update Profile
            </Text>
          </TouchableOpacity>

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
      <AppleIAPSubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false);
          setUserToken(undefined);
        }}
        onUpgrade={handleUpgradeSubscription}
        userToken={userToken}
        userId={userState.user?.id}
      />
      <UserProfileUpdateModal
        visible={showProfileUpdateModal}
        onClose={() => setShowProfileUpdateModal(false)}
        onUpdate={() => {
          // Refresh user data if needed
          console.log("Profile updated, refreshing data...");
        }}
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
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  subscriptionContent: {
    marginTop: 15,
  },
  subscriptionInfo: {
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  subscriptionStatus: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subscriptionDescription: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
    marginTop: 15,
    width: "100%",
    minHeight: 50,
    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#FFFFFF",
  },
  subscriptionActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 15,
  },
  subscriptionDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 12,
    opacity: 0.85,
    lineHeight: 20,
    flex: 1,
  },
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  disclaimerText: {
    fontSize: 13,
    fontStyle: "italic",
    opacity: 0.9,
    lineHeight: 18,
    flex: 1,
  },
  paletteSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
    letterSpacing: 0.5,
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
    flex: 1,
    minHeight: 48,
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
