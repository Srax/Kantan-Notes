import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, IconButton, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import noteController from "../controllers/Note.controller";
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import Note from "../types/Note.type";
import NoteBox from "../components/NoteBox.component";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import { mapIndexToData, Item } from "../utils/draggable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types/Routes.type";
import Searchbar from "../components/SearchBar.component";
import CustomHeader from "../components/CustomHeader.component";
import RichNote from "../types/Note.type";
import richNoteController from "../controllers/Note.controller";

import { convert } from "html-to-text";
import RoundIconButton from "../components/buttons/RoundIconButton";

type HomeScreenProps = {
  route: RouteProp<RootStackParamList, "Home">;
  navigation: NavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {
  const [notes, setNotes] = useState<RichNote[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<RichNote[]>([]);

  // Filter notes based on search query
  useEffect(() => {
    setFilteredNotes(
      notes.filter((note: RichNote) => {
        let contentMatch = convert(note.getContent())
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return contentMatch;
      })
    );
  }, [notes, searchQuery]);

  const fetchNotes = async () => {
    const storedOrder = await retrieveNoteOrder();
    const fetchedNotes = await richNoteController.getAllNotes();
    if (storedOrder.length > 0) {
      const reorderedNotes = fetchedNotes.sort((a, b) => {
        const positionA = storedOrder.indexOf(String(a.getId()));
        const positionB = storedOrder.indexOf(String(b.getId()));
        return positionA - positionB;
      });
      setNotes(reorderedNotes);
    } else {
      setNotes(fetchedNotes);
    }
  };

  const storeNoteOrder = async (noteOrder: string[]) => {
    try {
      await AsyncStorage.setItem("noteOrder", JSON.stringify(noteOrder));
    } catch (error) {
      console.error("Error storing note order:", error);
      // Implement error handling here
    }
  };

  const onDragEnd = ({ data }: { data: RichNote[] }) => {
    const newNoteOrder = data.map((note: RichNote) => String(note.getId()));
    storeNoteOrder(newNoteOrder);
    setNotes(data);
  };

  const retrieveNoteOrder = async (): Promise<string[]> => {
    try {
      const storedOrderString = await AsyncStorage.getItem("noteOrder");
      if (storedOrderString) {
        return JSON.parse(storedOrderString) as string[];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error retrieving note order:", error);
      return [];
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<RichNote>) => {
    const handleClick = () => {
      navigation.navigate("Preview", {
        noteId: item.getId() as number,
      });
    };

    return (
      <ScaleDecorator>
        <NoteBox
          key={item.getId()}
          note={item}
          onPress={handleClick}
          onLongPress={searchQuery ? undefined : drag}
          disabled={isActive}
        />
      </ScaleDecorator>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header>
          <Appbar.Content
            title={
              <Searchbar
                value={searchQuery}
                placeholder={"Search your notes"}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
              />
            }
          />
        </Appbar.Header>
      ),
    });
  }, [searchQuery]);

  // Reload page every time it is focused
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        await fetchNotes();
      })();
    }, [route])
  );

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={filteredNotes}
        onDragEnd={onDragEnd}
        keyExtractor={(item) => item.getId().toString()}
        renderItem={renderItem}
      />
      <RoundIconButton
        icon={"plus"}
        onPress={() =>
          navigation.navigate("Edit", {
            noteId: undefined,
            autoFocus: true,
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2%",
  },
});

export default HomeScreen;
