import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  LoveLetter,
  updateLoveLetter,
  deleteLoveLetter,
} from "../adapters/loveLetterAdapters";

interface LoveLetterModalProps {
  letter: LoveLetter;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  letter,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const { currentPalette } = useTheme();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!letter.is_encrypted);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(letter.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordSubmit = () => {
    if (password === "ILUVU") {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      Alert.alert(
        "Incorrect Password",
        "Please enter the correct password to view this letter."
      );
      setPassword("");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(letter.content);
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await updateLoveLetter(letter.id, { content: editedContent });
      Alert.alert("Success", "Love letter updated successfully!");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating love letter:", error);
      Alert.alert("Error", "Failed to update love letter");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(letter.content);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Love Letter",
      "Are you sure you want to delete this love letter? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLoveLetter(letter.id);
              Alert.alert("Success", "Love letter deleted successfully!");
              onDelete();
            } catch (error) {
              console.error("Error deleting love letter:", error);
              Alert.alert("Error", "Failed to delete love letter");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
            Love Letter
          </Text>
          <View style={styles.headerActions}>
            {isAuthenticated && !isEditing && (
              <>
                <TouchableOpacity
                  onPress={handleEdit}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={currentPalette.quaternary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {!isAuthenticated ? (
            // Password Protection
            <View style={styles.passwordContainer}>
              <Ionicons
                name="lock-closed"
                size={60}
                color={currentPalette.quaternary}
              />
              <Text
                style={[
                  styles.passwordTitle,
                  { color: currentPalette.tertiary },
                ]}
              >
                This letter is encrypted
              </Text>
              <Text
                style={[
                  styles.passwordSubtitle,
                  { color: currentPalette.quinary },
                ]}
              >
                Enter the 5-letter password to view this love letter
              </Text>
              <TextInput
                style={[
                  styles.passwordInput,
                  {
                    backgroundColor: currentPalette.secondary,
                    color: currentPalette.tertiary,
                    borderColor: currentPalette.quaternary,
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={currentPalette.quinary}
                secureTextEntry
                maxLength={5}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[
                  styles.passwordButton,
                  { backgroundColor: currentPalette.quaternary },
                ]}
                onPress={handlePasswordSubmit}
              >
                <Text
                  style={[
                    styles.passwordButtonText,
                    { color: currentPalette.tertiary },
                  ]}
                >
                  Unlock Letter
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Letter Content
            <View style={styles.letterContainer}>
              <View style={styles.letterHeader}>
                <Text
                  style={[
                    styles.recipient,
                    { color: currentPalette.quaternary },
                  ]}
                >
                  To: {letter.recipient}
                </Text>
                <Text style={[styles.date, { color: currentPalette.quinary }]}>
                  {formatDate(letter.written_date)}
                </Text>
                <Text
                  style={[styles.occasion, { color: currentPalette.tertiary }]}
                >
                  {letter.occasion}
                </Text>
              </View>

              <View style={styles.letterContent}>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.contentInput,
                      {
                        backgroundColor: currentPalette.secondary,
                        color: currentPalette.tertiary,
                        borderColor: currentPalette.quaternary,
                      },
                    ]}
                    value={editedContent}
                    onChangeText={setEditedContent}
                    multiline
                    textAlignVertical="top"
                    placeholder="Write your love letter here..."
                    placeholderTextColor={currentPalette.quinary}
                  />
                ) : (
                  <Text
                    style={[
                      styles.contentText,
                      { color: currentPalette.tertiary },
                    ]}
                  >
                    {letter.content}
                  </Text>
                )}
              </View>

              {isEditing && (
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      { borderColor: currentPalette.quaternary },
                    ]}
                    onPress={handleCancelEdit}
                  >
                    <Text
                      style={[
                        styles.cancelButtonText,
                        { color: currentPalette.quaternary },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      {
                        backgroundColor: isUpdating
                          ? currentPalette.quinary
                          : currentPalette.quaternary,
                      },
                    ]}
                    onPress={handleSave}
                    disabled={isUpdating}
                  >
                    <Text
                      style={[
                        styles.saveButtonText,
                        { color: currentPalette.tertiary },
                      ]}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  passwordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  passwordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  passwordSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 2,
    width: "100%",
    marginBottom: 20,
  },
  passwordButton: {
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  passwordButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  letterContainer: {
    padding: 20,
  },
  letterHeader: {
    marginBottom: 30,
    alignItems: "center",
  },
  recipient: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    marginBottom: 5,
  },
  occasion: {
    fontSize: 18,
    fontStyle: "italic",
  },
  letterContent: {
    marginBottom: 30,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 200,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoveLetterModal;
