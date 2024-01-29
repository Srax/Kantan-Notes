import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import * as SQLite from "expo-sqlite";
import openDatabase from "../../database";
import GridLayout, { Responsive, Layout } from "react-grid-layout";
import NoteBox from "../components/NoteBox.component";
import noteController, { Note } from "../controllers/Note.controller";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

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
    }, [route])
  );

  useEffect(() => {
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
      console.log("Routes were passed down to Home");
    }
  }, [route.params?.post]);

  // useEffect(() => {
  //   if (route.params?.note) {
  //     // Post updated, do something with `route.params.post`
  //     // For example, send the post to the server
  //     console.log("Routes were passed down to Home");
  //     console.log("We have data: " + JSON.stringify(route.params.note));
  //     const { title, text }: Note = route.params.note;
  //     console.log(title, text);
  //     const newNote: Note = { id: 1, title, text };
  //     handleSaveNote(newNote);
  //   }
  // }, [route.params?.post]);

  const handleSaveNote = (updatedNote: Note) => {
    console.log("Calling handle save note");
    const updatedNotes = notes.map((n) =>
      n.id === updatedNote.id ? updatedNote : n
    );
    setNotes(updatedNotes);
    // Also, implement logic to save the updated note to your database here
  };

  const createTestNote = async () => {
    // const newNote = new Note(1, "New Note", "This is a new note");
    // noteController.createNote(newNote).then(console.log);
    // await fetchNotes();
  };

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button
        onPress={() =>
          nav.navigate("NoteBlock", {
            noteId: undefined,
          })
        }
      >
        Create
      </Button>
      <Button onPress={noteController.purgeDatabase}>Purge</Button>
      <Divider />
      <View style={styles.noteList}>
        {notes.map((note) => (
          // <Text>{note.title}</Text>
          <NoteBox key={note.id} note={note} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noteList: {},
});

export default HomeScreen;
