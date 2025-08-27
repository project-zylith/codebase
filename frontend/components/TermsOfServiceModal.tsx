import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const { width } = Dimensions.get("window");

interface TermsOfServiceModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
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
              Terms of Service (EULA)
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
              Acceptance of Terms
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              By downloading, installing, or using the REN|AI application, you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use the application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Scope of License
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              We grant you a nontransferable license to use the REN|AI
              application on any Apple-branded products that you own or control.
              You may not distribute or make the app available over a network
              where it could be used by multiple devices simultaneously. You may
              not transfer, redistribute, or sublicense the application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Description of Service
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              REN|AI is a productivity application that provides note-taking,
              task management, and AI-powered insights. The service includes
              various subscription tiers with different feature sets and usage
              limits.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Subscription Terms
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              • Subscriptions automatically renew unless cancelled at least 24
              hours before the end of the current period
              {"\n"}• You can manage and cancel subscriptions in your device's
              App Store settings
              {"\n"}• Subscription prices may change with 30 days notice
              {"\n"}• Refunds are subject to App Store policies
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              User Responsibilities
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              • You are responsible for maintaining the security of your account
              {"\n"}• You must not use the service for any illegal or
              unauthorized purpose
              {"\n"}• You must not attempt to gain unauthorized access to the
              service
              {"\n"}• You are responsible for all content you create or upload
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Intellectual Property
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              The REN|AI application and its content are protected by copyright,
              trademark, and other intellectual property laws. You retain
              ownership of your content, but grant us a license to use it to
              provide the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Limitation of Liability
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              REN|AI is provided "as is" and "as available" with all faults and
              without warranty of any kind. We hereby disclaim all warranties
              and conditions with respect to the application and any services,
              either express, implied, or statutory. We are not liable for any
              damages arising from your use of the service, including but not
              limited to data loss, business interruption, or service
              interruptions.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Changes to Terms
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              We may update these terms from time to time. We will notify you of
              any material changes via email or through the application.
              Continued use of the service after changes constitutes acceptance
              of the new terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Consent to Use of Data
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              You agree that we may collect and use technical data and related
              information—including but not limited to technical information
              about your device, system and application software, and
              peripherals—that is gathered periodically to facilitate the
              provision of software updates, product support, and other services
              to you related to the REN|AI application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              External Services
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              The REN|AI application may enable access to our and/or third-party
              services and websites. You agree to use these services at your
              sole risk. We are not responsible for examining or evaluating the
              content or accuracy of any third-party services, and shall not be
              liable for any such third-party services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: currentPalette.tertiary }]}
            >
              Contact Information
            </Text>
            <Text
              style={[styles.sectionText, { color: currentPalette.quinary }]}
            >
              If you have questions about these Terms of Service, please contact
              us at{" "}
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
              Last updated: August 2025
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
