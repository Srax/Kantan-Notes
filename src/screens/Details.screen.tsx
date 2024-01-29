import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import MyComponent from "../components/MyComponent";
import NoteBlock from "../components/NoteBlock.component";

const DetailsScreen = () => {
  return (
    <View style={styles.container}>
      <NoteBlock
        autoFocus={true}
        onTitleChange={(title) => console.log("Title changed:", title)}
        onTextChange={(text) => console.log("Text changed:", text)}
      />
      {/* <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log("Button pressed")}
      >
        Press Me
      </Button> */}
      {/* <MyComponent /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default DetailsScreen;
