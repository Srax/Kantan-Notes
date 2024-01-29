import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import NoteBox from "./NoteBox.component"; // Assuming you have this component

const NewComponent = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: "Note 1", text: "This is the first note." },
    { id: 2, title: "Note 2", text: "This is the second note." },
    // ... more notes
  ]);

  return (
    <View style={styles.container}>
      <List.Section>
        {notes.map((note) => (
          <NoteBox key={note.id} note={note} />
        ))}
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Expand to fill available space
  },
});

export default NewComponent;
