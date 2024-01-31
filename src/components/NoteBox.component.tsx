import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native-paper";

const NoteBox = ({ note }) => {
  const nav = useNavigation();

  const handleClick = () => {
    nav.navigate("NoteBlock", {
      noteId: note.getId() as number,
    });
  };

  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.noteBox}>
        {note.getTitle() && (
          <Text variant="titleMedium">{note.getTitle()}</Text>
        )}
        <Text>{note.getText()}</Text>
      </View>
    </TouchableOpacity>
    // <TouchableOpacity onPress={handleClick}>
    //   <View style={styles.noteBox}>
    //     <Text>{note.text}</Text>
    //   </View>
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noteBox: {
    // Add your desired styling for the note box
    borderWidth: 1,
    padding: 6,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default NoteBox;
