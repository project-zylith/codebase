import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { getUserUsage } from "../adapters/subscriptionAdapters";
import { useState, useEffect } from "react";

interface UsageBarProps {
  current: number;
  limit: number;
  label: string;
  color: string;
}

const UsageBar: React.FC<UsageBarProps> = ({
  current,
  limit,
  label,
  color,
}) => {
  const { currentPalette } = useTheme();

  if (limit === -1) {
    return (
      <View style={styles.usageItem}>
        <Text style={[styles.usageLabel, { color: currentPalette.quinary }]}>
          {label}
        </Text>
        <View style={styles.unlimitedContainer}>
          <Ionicons name="infinite" size={16} color={color} />
          <Text style={[styles.unlimitedText, { color }]}>Unlimited</Text>
        </View>
      </View>
    );
  }

  const percentage = Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <View style={styles.usageItem}>
      <View style={styles.usageHeader}>
        <Text style={[styles.usageLabel, { color: currentPalette.quinary }]}>
          {label}
        </Text>
        <Text style={[styles.usageCount, { color: currentPalette.tertiary }]}>
          {current}/{limit}
        </Text>
      </View>

      <View
        style={[
          styles.progressBar,
          { backgroundColor: currentPalette.quinary + "20" },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: isAtLimit
                ? "#FF6B6B"
                : isNearLimit
                ? "#FFA726"
                : color,
            },
          ]}
        />
      </View>

      {isNearLimit && (
        <Text
          style={[
            styles.warningText,
            { color: isAtLimit ? "#FF6B6B" : "#FFA726" },
          ]}
        >
          {isAtLimit ? "Limit reached!" : "Near limit"}
        </Text>
      )}
    </View>
  );
};

export const SubscriptionStatusDisplay: React.FC = () => {
  const { currentPalette } = useTheme();
  const { state: subscriptionState, openSubscriptionModal } = useSubscription();
  const [usageData, setUsageData] = useState<any>(null);
  const [usageLoading, setUsageLoading] = useState(false);

  // Fetch usage data when subscription changes
  useEffect(() => {
    if (
      subscriptionState.subscription &&
      subscriptionState.subscription.status === "active"
    ) {
      fetchUsageData();
    }
  }, [subscriptionState.subscription]);

  const fetchUsageData = async () => {
    try {
      setUsageLoading(true);
      const data = await getUserUsage();
      setUsageData(data);
    } catch (error) {
      console.error("Failed to fetch usage data:", error);
    } finally {
      setUsageLoading(false);
    }
  };

  if (subscriptionState.isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: currentPalette.card }]}
      >
        <Text style={[styles.loadingText, { color: currentPalette.quinary }]}>
          Loading subscription status...
        </Text>
      </View>
    );
  }

  const subscription = subscriptionState.subscription;

  if (!subscription) {
    return (
      <View
        style={[styles.container, { backgroundColor: currentPalette.card }]}
      >
        <View style={styles.header}>
          <Ionicons
            name="diamond"
            size={24}
            color={currentPalette.quaternary}
          />
          <Text style={[styles.title, { color: currentPalette.tertiary }]}>
            Free Tier
          </Text>
        </View>

        <Text style={[styles.description, { color: currentPalette.quinary }]}>
          You're currently on the free tier with limited features.
        </Text>

        <TouchableOpacity
          style={[
            styles.upgradeButton,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={openSubscriptionModal}
        >
          <Ionicons name="arrow-up" size={16} color={currentPalette.tertiary} />
          <Text
            style={[
              styles.upgradeButtonText,
              { color: currentPalette.tertiary },
            ]}
          >
            Upgrade Now
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isActive = subscription.status === "active";
  const planName = subscription.plan_name || "Unknown Plan";

  return (
    <View style={[styles.container, { backgroundColor: currentPalette.card }]}>
      <View style={styles.header}>
        <Ionicons name="diamond" size={24} color={currentPalette.quaternary} />
        <Text style={[styles.title, { color: currentPalette.tertiary }]}>
          {planName}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isActive ? "#4CAF50" : "#FF9800" },
          ]}
        >
          <Text style={styles.statusText}>
            {isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: currentPalette.quinary }]}>
        {isActive
          ? `Your ${planName} subscription is active.`
          : "Your subscription is currently inactive."}
      </Text>

      {isActive && (
        <View style={styles.usageSection}>
          <View style={styles.usageHeader}>
            <Text
              style={[styles.usageTitle, { color: currentPalette.tertiary }]}
            >
              Current Usage
            </Text>
            <TouchableOpacity
              style={[
                styles.refreshButton,
                { backgroundColor: currentPalette.quinary + "20" },
              ]}
              onPress={fetchUsageData}
              disabled={usageLoading}
            >
              <Ionicons
                name="refresh"
                size={16}
                color={currentPalette.quaternary}
                style={
                  usageLoading
                    ? { transform: [{ rotate: "360deg" }] }
                    : undefined
                }
              />
            </TouchableOpacity>
          </View>

          <UsageBar
            current={usageData?.usage?.notes?.current || 0}
            limit={
              usageData?.usage?.notes?.limit || subscription.note_limit || 20
            }
            label="Notes"
            color={currentPalette.quaternary}
          />

          <UsageBar
            current={usageData?.usage?.tasks?.current || 0}
            limit={
              usageData?.usage?.tasks?.limit || subscription.task_limit || 10
            }
            label="Tasks"
            color={currentPalette.quaternary}
          />

          <UsageBar
            current={usageData?.usage?.galaxies?.current || 0}
            limit={
              usageData?.usage?.galaxies?.limit ||
              subscription.galaxy_limit ||
              3
            }
            label="Galaxies"
            color={currentPalette.quaternary}
          />

          <UsageBar
            current={usageData?.usage?.ai_insights?.current || 0}
            limit={
              usageData?.usage?.ai_insights?.limit ||
              subscription.ai_insights_per_day ||
              5
            }
            label="AI Insights (Daily)"
            color={currentPalette.quaternary}
          />
        </View>
      )}

      {!isActive && (
        <TouchableOpacity
          style={[
            styles.upgradeButton,
            { backgroundColor: currentPalette.quaternary },
          ]}
          onPress={openSubscriptionModal}
        >
          <Ionicons name="refresh" size={16} color={currentPalette.tertiary} />
          <Text
            style={[
              styles.upgradeButtonText,
              { color: currentPalette.tertiary },
            ]}
          >
            Reactivate Subscription
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  usageSection: {
    marginTop: 8,
  },
  usageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
  },
  usageItem: {
    marginBottom: 16,
  },
  usageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  usageLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  usageCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  unlimitedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  unlimitedText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});
