import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import * as SQLite from "expo-sqlite";
import openDatabase from "../../database";
import GridLayout, { Responsive, Layout } from "react-grid-layout";

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [database, setDatabase] = useState<SQLite.Database | undefined>(
    undefined
  );
  const [names, setNames] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentName, setCurrentName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const db = await openDatabase("notes.db"); // Replace with your desired name
      setDatabase(db);

      await database?.transaction(async (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, createdAt DATETIME)"
        );
      });

      await database?.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM notes",
          [],
          (txtObj, resultSet) => setNames(resultSet.rows._array),
          (txtObj, error) => console.error(error)
        );
      });
      setIsLoading(false);
    })();
  }, []);

  const showNames = () => {
    return names.map((item, index) => (
      <View style={styles.row} key={index}>
        <Text key={index}>{item.name}</Text>
        <Button onPress={() => deleteName(item.id)}>Delete</Button>
        <Button onPress={() => updateName(item.id)}>Update</Button>
      </View>
    ));
  };

  const addName = () => {
    if (currentName.length !== 0 && currentName.length > 0) {
      database?.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO names (name) values (?)",
          [currentName],
          (_, resultSet) => {
            let existingNames = [...names];
            existingNames.push({ id: resultSet.insertId, name: currentName });
            setNames(existingNames);
            setCurrentName("");
          },
          (_, error) => console.error(error)
        );
      });
    }
  };

  const deleteName = (id: any) => {
    database?.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM names where id = ?",
        [id],
        (_, resultSet) => {
          let existingNames = [...names].filter((name) => name.id !== id);
          setNames(existingNames);
        },
        (_, error) => console.error(error)
      );
    });
  };

  const updateName = (id) => {
    database?.transaction((tx) => {
      tx.executeSql(
        "UPDATE names set name = ? where id = ?",
        [currentName, id],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names];
            const indexToUpdate = existingNames.findIndex(
              (name) => name.id === id
            );

            existingNames[indexToUpdate].name = currentName;
            setNames(existingNames);
            setCurrentName("");
          }
        },
        (_, error) => console.error(error)
      );
    });
  };

  const notes = [
    { id: 1, title: "Note 1", text: "This is the first note." },
    { id: 2, title: "Note 2", text: "This is the second note." },
    // ... more notes
  ];

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate("Details")}>
        Go to details
      </Button>
      {/* <View style={styles.container}>
        <Text   Input
          mode={"outlined"}
          value={currentName}
          placeholder="name"
          onChangeText={setCurrentName}
        />
        <Button mode={"contained"} onPress={addName}>
          Add Name
        </Button>
        {showNames()}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
