import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  CreateLoveLetterRequest,
  createLoveLetter,
  getOccasions,
} from "../adapters/loveLetterAdapters";

interface LoveLetterFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

const LoveLetterForm: React.FC<LoveLetterFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const { currentPalette } = useTheme();
  const [recipient, setRecipient] = useState("");
  const [writtenDate, setWrittenDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [occasion, setOccasion] = useState("");
  const [content, setContent] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [availableOccasions, setAvailableOccasions] = useState<string[]>([]);
  const [showOccasionDropdown, setShowOccasionDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedOccasions = [
    "Birthday",
    "Anniversary",
    "Graduation",
    "Valentine's Day",
    "Christmas",
    "New Year",
    "Just Because",
    "I Miss You",
    "Thank You",
    "Congratulations",
  ];

  useEffect(() => {
    loadOccasions();
  }, []);

  const loadOccasions = async () => {
    try {
      const occasions = await getOccasions();
      const allOccasions = [...new Set([...predefinedOccasions, ...occasions])];
      setAvailableOccasions(allOccasions);
    } catch (error) {
      console.error("Error loading occasions:", error);
      setAvailableOccasions(predefinedOccasions);
    }
  };

  const handleSubmit = async () => {
    if (!recipient || !writtenDate || !occasion || !content) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const loveLetterData: CreateLoveLetterRequest = {
        recipient,
        written_date: writtenDate,
        occasion,
        content,
        is_encrypted: isEncrypted,
      };

      await createLoveLetter(loveLetterData);
      Alert.alert("Success", "Love letter created successfully!");
      onSubmit();
    } catch (error) {
      console.error("Error creating love letter:", error);
      Alert.alert("Error", "Failed to create love letter");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOccasionSelect = (selectedOccasion: string) => {
    setOccasion(selectedOccasion);
    setShowOccasionDropdown(false);
  };

  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <View
        style={[styles.container, { backgroundColor: currentPalette.primary }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={currentPalette.tertiary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: currentPalette.tertiary }]}>
            Write a Love Letter
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Recipient Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: currentPalette.tertiary }]}>
              To:
            </Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: currentPalette.secondary,
                    borderColor: currentPalette.quaternary,
                  },
                ]}
                onPress={() => setShowOccasionDropdown(!showOccasionDropdown)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  {recipient || "Select recipient"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={currentPalette.tertiary}
                />
              </TouchableOpacity>
              {showOccasionDropdown && (
                <View
                  style={[
                    styles.dropdownMenu,
                    { backgroundColor: currentPalette.secondary },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleOccasionSelect("Honeybee")}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        { color: currentPalette.tertiary },
                      ]}
                    >
                      Honeybee
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleOccasionSelect("Bibi")}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        { color: currentPalette.tertiary },
                      ]}
                    >
                      Bibi
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Date */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: currentPalette.tertiary }]}>
              Date Written:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: currentPalette.secondary,
                  color: currentPalette.tertiary,
                  borderColor: currentPalette.quaternary,
                },
              ]}
              value={writtenDate}
              onChangeText={setWrittenDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={currentPalette.quinary}
            />
          </View>

          {/* Occasion Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: currentPalette.tertiary }]}>
              Occasion:
            </Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: currentPalette.secondary,
                    borderColor: currentPalette.quaternary,
                  },
                ]}
                onPress={() => setShowOccasionDropdown(!showOccasionDropdown)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  {occasion || "Select occasion"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={currentPalette.tertiary}
                />
              </TouchableOpacity>
              {showOccasionDropdown && (
                <View
                  style={[
                    styles.dropdownMenu,
                    { backgroundColor: currentPalette.secondary },
                  ]}
                >
                  {availableOccasions.map((occ, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => handleOccasionSelect(occ)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          { color: currentPalette.tertiary },
                        ]}
                      >
                        {occ}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Content */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: currentPalette.tertiary }]}>
              Love Letter Content:
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: currentPalette.secondary,
                  color: currentPalette.tertiary,
                  borderColor: currentPalette.quaternary,
                },
              ]}
              value={content}
              onChangeText={setContent}
              placeholder="Write your love letter here..."
              placeholderTextColor={currentPalette.quinary}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>

          {/* Encryption Toggle */}
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.encryptionToggle}
              onPress={() => setIsEncrypted(!isEncrypted)}
            >
              <Ionicons
                name={isEncrypted ? "lock-closed" : "lock-open"}
                size={20}
                color={isEncrypted ? "#ff6b6b" : currentPalette.tertiary}
              />
              <Text
                style={[
                  styles.encryptionText,
                  { color: currentPalette.tertiary },
                ]}
              >
                Encrypt this letter (Password: ILUVU)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: isSubmitting
                  ? currentPalette.quinary
                  : "#ff6b6b",
              },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Creating..." : "Create Love Letter"}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  encryptionToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  encryptionText: {
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoveLetterForm;
