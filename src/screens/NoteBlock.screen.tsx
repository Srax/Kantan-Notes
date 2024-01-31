import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { TextInput as RNTextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MyComponent from "../components/MyComponent";
import noteController from "../controllers/Note.controller";
import Note from "../types/Note.type";

const NoteBlock: React.FC = ({ route, navigation }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [note, setNote] = useState<Note | null>(null);

  const titleInputRef = useRef<RNTextInput>(null);
  const textInputRef = useRef<RNTextInput>(null);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <Button onPress={() => handleSave()}>
  //         {note ? "Update" : "Create"}
  //       </Button>
  //     ),
  //   });
  // }, [navigation, title, text, note]);

  // useLayoutEffect ensure that our header gets the updated version of our usestates
  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      handleSave();
    });
    return unsubscribe; // Cleanup function to remove the listener
  }, [navigation, title, text, note]);

  const { noteId } = route.params;

  const showToast = (text: string) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  const handleTitleInputPress = () => {
    if (titleInputRef.current) {
      textInputRef.current?.focus(); // Focus the next text field
    }
  };

  useEffect(() => {
    async function init() {
      if (noteId) {
        const fet = await noteController.getNoteById(noteId);
        if (fet != null) {
          setTitle(fet.getTitle());
          setText(fet.getText());
          setNote(fet);
        }
      }
    }
    init();
  }, []);

  const handleSave = async () => {
    try {
      if (!note) {
        if (!title && !text) {
          showToast("Empty note discarded");
          return;
        }
        let n = new Note(-1, title, text, 0, 0);
        await noteController.createNote(n);
        showToast("Note created");
        return;
      }
      const _note: Note = note;
      _note.setTitle(title);
      _note.setText(text);
      await noteController.updateNote(_note);
      showToast("Note updated");
    } catch (error) {
      showToast("Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TextInput
          ref={titleInputRef}
          mode="flat"
          value={title}
          placeholder={"Title"}
          autoFocus={false}
          onChangeText={(txt) => {
            setTitle(txt);
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
          value={text}
          ref={textInputRef}
          autoFocus={true}
          multiline
          onChangeText={(txt) => {
            setText(txt);
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
