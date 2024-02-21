import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { INavigation } from "../helpers/richtext/interface";
import { RootStackParamList } from "../types/Routes.type";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import RichNote from "../types/Note.type";
import richNoteController from "../controllers/Note.controller";
import { Appbar, Text } from "react-native-paper";
import RoundIconButton from "../components/buttons/RoundIconButton";

interface IProps {
  route: RouteProp<RootStackParamList, "Preview">;
  navigation: NavigationProp<RootStackParamList, "Preview">;
}

export const Preview: FC<IProps> = ({ route, navigation }) => {
  const [note, setNote] = useState<RichNote | null>(null);
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  let { noteId } = route.params;

  useEffect(() => {
    setIsLoading(true);
    async function init() {
      if (noteId) {
        const fetched = await richNoteController.getNoteById(noteId);
        if (fetched) {
          setHtml(
            `<html><head><meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">${fetched.getCss()}</head><body>${fetched.getContent()}</body></html>`
          );
          setNote(fetched);
          setIsLoading(false);
        }
      }
    }

    const focusHandler = navigation.addListener("focus", async () => {
      await init();
    });
    return focusHandler;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={null} />
          <Appbar.Action icon="note-edit-outline" onPress={handleEdit} />
          <Appbar.Action icon="delete" onPress={handleDelete} />
          {/* <Appbar.Action icon="dots-vertical" onPress={() => {}} /> */}
        </Appbar.Header>
      ),
    });
  }, [navigation, note]);

  const handleEdit = () => {
    navigation.navigate("Edit", {
      noteId: note?.getId(),
    });
  };
  const showToast = (text: string) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (noteId != null) {
        const noteExists = await richNoteController.recordExists(noteId);
        if (noteExists) {
          await richNoteController.deleteNote(noteId);
          showToast("Note deleted");
        }
      }
      // hideDialog();
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      showToast("Something went wrong");
    } finally {
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <WebView
            useWebKit={true}
            scrollEnabled={false}
            hideKeyboardAccessoryView={true}
            keyboardDisplayRequiresUserAction={false}
            originWhitelist={["*"]}
            dataDetectorTypes={"none"}
            domStorageEnabled={false}
            bounces={false}
            javaScriptEnabled={true}
            source={{ html }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
});
