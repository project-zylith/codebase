import { Alert } from "react-native";

export interface SubscriptionLimitError {
  error: string;
  current: number;
  limit: number;
  resourceType: string;
  upgradeRequired: boolean;
  message: string;
}

export const handleSubscriptionLimitError = (
  error: any,
  onUpgrade?: () => void
) => {
  // Check if this is a subscription limit error
  if (
    error?.upgradeRequired ||
    error?.error?.includes("Subscription limit reached")
  ) {
    const errorData = error as SubscriptionLimitError;

    const resourceName =
      errorData.resourceType === "ai_insights"
        ? "AI insights"
        : errorData.resourceType === "notes"
        ? "notes"
        : errorData.resourceType === "tasks"
        ? "tasks"
        : errorData.resourceType === "galaxies"
        ? "galaxies"
        : errorData.resourceType;

    const limitText = errorData.limit === -1 ? "unlimited" : errorData.limit;
    const currentText = errorData.current || 0;

    Alert.alert(
      "Upgrade Required",
      `You've reached your ${resourceName} limit (${currentText}/${limitText}). Upgrade your subscription to continue using this feature.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Upgrade",
          onPress:
            onUpgrade ||
            (() => {
              // Default behavior - could navigate to subscription page
              console.log("Upgrade subscription requested");
            }),
        },
      ]
    );

    return true; // Error was handled
  }

  // Check if this is a general subscription requirement error
  if (
    error?.error?.includes("Active subscription required") ||
    error?.error?.includes("Insufficient subscription plan")
  ) {
    Alert.alert(
      "Subscription Required",
      error.message ||
        "This feature requires an active subscription. Please upgrade to continue.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Upgrade",
          onPress:
            onUpgrade ||
            (() => {
              console.log("Upgrade subscription requested");
            }),
        },
      ]
    );

    return true; // Error was handled
  }

  return false; // Error was not handled
};

export const showSubscriptionUpgradePrompt = (
  featureName: string,
  onUpgrade?: () => void
) => {
  Alert.alert(
    "Upgrade Required",
    `${featureName} requires a premium subscription. Upgrade now to unlock this feature and many more!`,
    [
      {
        text: "Maybe Later",
        style: "cancel",
      },
      {
        text: "Upgrade Now",
        onPress:
          onUpgrade ||
          (() => {
            console.log("Upgrade subscription requested");
          }),
      },
    ]
  );
};

export const showLimitReachedPrompt = (
  resourceType: string,
  current: number,
  limit: number,
  onUpgrade?: () => void
) => {
  const resourceName =
    resourceType === "ai_insights"
      ? "AI insights"
      : resourceType === "notes"
      ? "notes"
      : resourceType === "tasks"
      ? "tasks"
      : resourceType === "galaxies"
      ? "galaxies"
      : resourceType;

  const limitText = limit === -1 ? "unlimited" : limit;

  Alert.alert(
    "Limit Reached",
    `You've reached your ${resourceName} limit (${current}/${limitText}). Upgrade your subscription to continue creating more ${resourceName}.`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Upgrade",
        onPress:
          onUpgrade ||
          (() => {
            console.log("Upgrade subscription requested");
          }),
      },
    ]
  );
};
