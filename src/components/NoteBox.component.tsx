import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Button, Card, Text, useTheme } from "react-native-paper";

const NoteBox = ({ note }) => {
  const nav = useNavigation();
  const theme = useTheme();

  const handleClick = () => {
    nav.navigate("NoteBlock", {
      noteId: note.getId() as number,
    });
  };

  return (
    <Card onPress={handleClick} style={styles.noteBox}>
      <Card.Title
        title={note.getTitle()}
        subtitle={note.getText()}
        titleVariant={"titleMedium"}
        subtitleNumberOfLines={5}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  noteBox: {
    padding: 6,
    marginBottom: 6,
    marginTop: 6,
  },
});

export default NoteBox;
