import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Button, Card, Text, useTheme } from "react-native-paper";
import Note from "../types/Note.type";

type NoteBoxProps = {
  note: Note;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
};

const NoteBox: React.FC<NoteBoxProps> = ({
  note,
  onPress,
  onLongPress,
  disabled,
}) => {
  return (
    <View style={styles.container}>
      <Card
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.noteBox}
        disabled={disabled}
        delayLongPress={200}
        mode={"outlined"}
        theme={{ colors: { outline: "lightgray" } }}
      >
        <Card.Title
          title={note.getTitle()}
          subtitle={note.getText()}
          titleVariant={"titleMedium"}
          subtitleNumberOfLines={5}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  noteBox: {
    backgroundColor: "#ffffff",
    marginLeft: 1,
    marginRight: 1,
    marginBottom: 6,
    marginTop: 6,
  },
});

export default NoteBox;
