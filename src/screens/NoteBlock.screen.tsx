import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, ToastAndroid, Keyboard } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { TextInput as RNTextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import noteController from "../controllers/Note.controller";
import Note from "../types/Note.type";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/Routes.type";

type NoteBlockProps = {
  route: RouteProp<RootStackParamList, "NoteBlock">; // Use RouteProp with RootStackParamList
  navigation: NavigationProp<RootStackParamList, "NoteBlock">;
};

const NoteBlock: React.FC<NoteBlockProps> = ({ route, navigation }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [note, setNote] = useState<Note | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const hideDialog = () => setVisible(false);

  const titleInputRef = useRef<RNTextInput>(null);
  const textInputRef = useRef<RNTextInput>(null);

  const { noteId, autoFocus } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Appbar.Action icon="delete" onPress={() => setVisible(true)} />
      ),
    });
  }, [navigation, title, text, note, isDeleting]);

  // useLayoutEffect ensure that our header gets the updated version of our usestates
  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      if (!isDeleting) handleSave();
    });
    return unsubscribe; // Cleanup function to remove the listener
  }, [navigation, title, text, note, isDeleting]);

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (noteId != null) {
        const noteExists = await noteController.recordExists(noteId);
        if (noteExists) {
          await noteController.deleteNote(noteId);
          showToast("Note deleted");
        }
      }
      hideDialog();
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      showToast("Something went wrong");
    } finally {
      Keyboard.dismiss();
    }
  };

  const handleSave = async () => {
    try {
      if (!title && !text) {
        showToast("Empty note discarded");
        return;
      }
      if (!note) {
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
      return;
    } catch (error) {
      console.error(error);
      showToast("Something went wrong");
    } finally {
      Keyboard.dismiss();
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
          autoFocus={autoFocus || false}
          multiline
          onChangeText={(txt) => {
            setText(txt);
          }}
          style={styles.textInput}
          underlineColor={"transparent"}
          activeUnderlineColor={"transparent"}
          cursorColor="black"
        />
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={styles.dialogTitle}>Delete note</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium" style={styles.dialogContentText}>
                Are you sure you wish to delete this note?
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={handleDelete} textColor="red">
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
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
  dialogTitle: {
    textAlign: "center",
    fontSize: 18,
  },
  dialogContentText: {
    textAlign: "center",
  },
  dialogActions: {},
});

export default NoteBlock;
