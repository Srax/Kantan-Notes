import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { TextInput as RNTextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MyComponent from "./MyComponent";

interface NoteBlockProps {
  initialTitle?: string;
  initialText?: string;
  autoFocus?: boolean;
  onTitleChange?: (title: string) => void;
  onTextChange?: (text: string) => void;
}

const NoteBlock: React.FC<NoteBlockProps> = ({
  initialTitle,
  initialText,
  autoFocus,
  onTitleChange,
  onTextChange,
}) => {
  const [noteTitle, setNoteTitle] = useState(initialTitle || "");
  const [noteText, setNoteText] = useState(initialText || "");
  const titleInputRef = useRef<RNTextInput>(null);
  const textInputRef = useRef<RNTextInput>(null);

  const handleTitleInputPress = () => {
    if (titleInputRef.current) {
      textInputRef.current?.focus(); // Focus the next text field
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TextInput
          ref={titleInputRef}
          mode="flat"
          value={noteTitle}
          placeholder={"Title"}
          autoFocus={false}
          onChangeText={(txt) => {
            setNoteTitle(txt);
            onTitleChange?.(txt);
          }}
          onSubmitEditing={handleTitleInputPress} // Handle "enter" press
          blurOnSubmit={false}
          style={styles.titleInput}
          multiline={false} // Restrict to one line
          underlineColor={"transparent"}
          activeUnderlineColor={"transparent"}
          cursorColor="black"
        />
        <TextInput
          mode="flat"
          placeholder="Note"
          value={noteText}
          ref={textInputRef}
          autoFocus={autoFocus}
          multiline
          onChangeText={(txt) => {
            setNoteText(txt);
            onTextChange?.(txt);
          }}
          style={styles.textInput}
          underlineColor={"transparent"}
          activeUnderlineColor={"transparent"}
          cursorColor="black"
        />
      </ScrollView>
      <MyComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Expand to fill entire screen
  },
  scrollView: {
    flex: 1, // Ensure ScrollView fills container
  },
  textInput: {
    flex: 1, // Expand to fill container
    padding: 0,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  titleInput: {
    flex: 1, // Expand to fill container
    padding: 0,
    backgroundColor: "transparent",
    fontSize: 24,
  },
});

export default NoteBlock;
