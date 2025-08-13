import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  updateUserEmail,
  updateUserPassword,
  deleteUserAccount,
} from "../adapters/userAdapters";
import { useUser } from "../contexts/UserContext";

interface UserProfileUpdateModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const UserProfileUpdateModal: React.FC<UserProfileUpdateModalProps> = ({
  visible,
  onClose,
  onUpdate,
}) => {
  const { currentPalette } = useTheme();
  const { state: userState } = useUser();

  const [activeTab, setActiveTab] = useState<"email" | "password" | "account">(
    "email"
  );
  const [loading, setLoading] = useState(false);

  // Email update state
  const [newEmail, setNewEmail] = useState(userState.user?.email || "");

  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailUpdate = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (newEmail === userState.user?.email) {
      Alert.alert("Info", "Email is already set to this value");
      return;
    }

    setLoading(true);
    try {
      const response = await updateUserEmail(newEmail);

      if (response && response.ok) {
        Alert.alert("Success", "Email updated successfully!");
        onUpdate();
        onClose();
      } else if (response) {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to update email");
      } else {
        Alert.alert("Error", "Network error occurred");
      }
    } catch (error) {
      console.error("Email update error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account, all your data (notes, tasks, galaxies), and end your subscription. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserAccount();
              Alert.alert(
                "Account Deleted",
                "Your account has been permanently deleted. You will be logged out.",
                [
                  {
                    text: "OK",
                    onPress: async () => {
                      // Close modal and trigger logout
                      onClose();
                      // Note: The logout will be handled by the parent component
                      // when it detects the user is no longer authenticated
                    },
                  },
                ]
              );
            } catch (error: any) {
              console.error("Delete account error:", error);
              Alert.alert(
                "Error",
                error.message || "Failed to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await updateUserPassword(currentPassword, newPassword);

      if (response && response.ok) {
        Alert.alert("Success", "Password updated successfully!");
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onUpdate();
        onClose();
      } else if (response) {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to update password");
      } else {
        Alert.alert("Error", "Network error occurred");
      }
    } catch (error) {
      console.error("Password update error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderEmailTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.tabSubtitle, { color: currentPalette.quinary }]}>
        Update your email address
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentPalette.tertiary }]}>
          Current Email
        </Text>
        <Text style={[styles.currentValue, { color: currentPalette.quinary }]}>
          {userState.user?.email}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentPalette.tertiary }]}>
          New Email
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentPalette.secondary,
              color: currentPalette.tertiary,
              borderColor: currentPalette.quinary,
            },
          ]}
          placeholder="Enter new email"
          placeholderTextColor={currentPalette.quinary}
          value={newEmail}
          onChangeText={setNewEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.updateButton,
          { backgroundColor: currentPalette.quaternary },
        ]}
        onPress={handleEmailUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={currentPalette.tertiary} />
        ) : (
          <Text
            style={[
              styles.updateButtonText,
              { color: currentPalette.tertiary },
            ]}
          >
            Update Email
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderPasswordTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.tabSubtitle, { color: currentPalette.quinary }]}>
        Update your password
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentPalette.tertiary }]}>
          Current Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentPalette.secondary,
              color: currentPalette.tertiary,
              borderColor: currentPalette.quinary,
            },
          ]}
          placeholder="Enter current password"
          placeholderTextColor={currentPalette.quinary}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoComplete="off"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentPalette.tertiary }]}>
          New Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentPalette.secondary,
              color: currentPalette.tertiary,
              borderColor: currentPalette.quinary,
            },
          ]}
          placeholder="Enter new password (min 6 characters)"
          placeholderTextColor={currentPalette.quinary}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoComplete="off"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentPalette.tertiary }]}>
          Confirm New Password
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: currentPalette.secondary,
              color: currentPalette.tertiary,
              borderColor: currentPalette.quinary,
            },
          ]}
          placeholder="Confirm new password"
          placeholderTextColor={currentPalette.quinary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="off"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.updateButton,
          { backgroundColor: currentPalette.quaternary },
        ]}
        onPress={handlePasswordUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={currentPalette.tertiary} />
        ) : (
          <Text
            style={[
              styles.updateButtonText,
              { color: currentPalette.tertiary },
            ]}
          >
            Update Password
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderAccountTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.tabSubtitle, { color: currentPalette.quinary }]}>
        Manage your account settings
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentPalette.quinary }]}>
          Current Username
        </Text>
        <Text style={[styles.currentValue, { color: currentPalette.quinary }]}>
          {userState.user?.username}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentPalette.quinary }]}>
          Current Email
        </Text>
        <Text style={[styles.currentValue, { color: currentPalette.quinary }]}>
          {userState.user?.email}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.updateButton,
          {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "#dc2626",
          },
        ]}
        onPress={handleDeleteAccount}
      >
        <Text style={[styles.updateButtonText, { color: "#dc2626" }]}>
          Delete Account
        </Text>
      </TouchableOpacity>
    </View>
  );

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
        <View
          style={[styles.header, { borderBottomColor: currentPalette.quinary }]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={currentPalette.tertiary} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: currentPalette.tertiary }]}
          >
            Update Profile
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "email" && {
                borderBottomColor: currentPalette.quaternary,
              },
            ]}
            onPress={() => setActiveTab("email")}
          >
            <Text
              style={[
                styles.tabText,
                { color: currentPalette.tertiary },
                activeTab === "email" && { color: currentPalette.quaternary },
              ]}
            >
              Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "password" && {
                borderBottomColor: currentPalette.quaternary,
              },
            ]}
            onPress={() => setActiveTab("password")}
          >
            <Text
              style={[
                styles.tabText,
                { color: currentPalette.tertiary },
                activeTab === "password" && {
                  color: currentPalette.quaternary,
                },
              ]}
            >
              Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "account" && {
                borderBottomColor: currentPalette.quaternary,
              },
            ]}
            onPress={() => setActiveTab("account")}
          >
            <Text
              style={[
                styles.tabText,
                { color: currentPalette.tertiary },
                activeTab === "account" && {
                  color: currentPalette.quaternary,
                },
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === "email"
            ? renderEmailTab()
            : activeTab === "password"
            ? renderPasswordTab()
            : renderAccountTab()}
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
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    gap: 20,
  },
  tabSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  currentValue: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 48,
  },
  updateButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UserProfileUpdateModal;
