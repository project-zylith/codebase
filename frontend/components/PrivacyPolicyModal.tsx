import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
}) => {
  const { currentPalette } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: currentPalette.card },
            { borderBottomColor: currentPalette.quinary },
          ]}
        >
          <View style={styles.headerContent}>
            <Text
              style={[styles.headerTitle, { color: currentPalette.tertiary }]}
            >
              Privacy Policy
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={currentPalette.quaternary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Information We Collect
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              We collect information you provide directly to us, such as when
              you create an account, make a purchase, or contact us for support.
              This may include your name, email address, and payment
              information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              How We Use Your Information
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              We use the information we collect to provide, maintain, and
              improve our services, process transactions, send you technical
              notices and support messages, and respond to your comments and
              questions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Information Sharing
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy or as required by law.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Data Security
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Your Rights
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              You have the right to access, update, or delete your personal
              information. You may also opt out of certain communications from
              us.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Contact Us
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <Text style={{ color: currentPalette.quaternary }}>
                ibrahim.hudson.swe@gmail.com
              </Text>
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionText,
                {
                  color: currentPalette.quinary,
                  fontSize: 12,
                  fontStyle: "italic",
                },
              ]}
            >
              Last updated: January 2025
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { backgroundColor: currentPalette.card },
            { borderTopColor: currentPalette.quinary },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.closeFooterButton,
              { backgroundColor: currentPalette.button },
            ]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.closeFooterButtonText,
                { color: currentPalette.buttonText },
              ]}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  closeFooterButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  closeFooterButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
