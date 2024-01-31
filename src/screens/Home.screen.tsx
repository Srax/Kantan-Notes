import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import noteController from "../controllers/Note.controller";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Note from "../types/Note.type";
import NoteBox from "../components/NoteBox.component";

const HomeScreen: React.FC = ({ route }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const nav = useNavigation();

  const fetchNotes = async () => {
    const fetchedNotes = await noteController.getAllNotes();
    setNotes(fetchedNotes);
  };

  // Reload page every time it is focused
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        await fetchNotes();
      })();

      nav.setOptions({
        headerRight: () => (
          <Button
            onPress={() =>
              nav.navigate("NoteBlock", {
                noteId: undefined,
                autoFocus: true,
              })
            }
          >
            Create
          </Button>
        ),
      });
    }, [route])
  );

  return (
    <View style={styles.container}>
      <View style={styles.noteList}>
        {notes.map((note) => (
          <NoteBox key={note.getId()} note={note} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2%",
  },
  noteList: {},
});

export default HomeScreen;
