import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { TenTapEditorNew } from "./TenTapEditorNew";
import colorPalette from "../assets/colorPalette";

export const EditorScreen = () => {
  const handleContentChange = (html: string, text: string) => {
    console.log("Content changed:", { html, text });
  };

  const handleSave = (html: string, text: string) => {
    console.log("Content saved:", { html, text });
    // Here you would typically save to backend or local storage
  };

  return (
    <SafeAreaView style={styles.container}>
      <TenTapEditorNew
        initialContent=""
        onContentChange={handleContentChange}
        onSave={handleSave}
        placeholder="Start writing your note..."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.tertiary,
  },
});
