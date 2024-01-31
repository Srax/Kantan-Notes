import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import {
  Button,
  DefaultTheme,
  Provider as PaperProvider,
  Text,
  TextInput,
} from "react-native-paper";
import CustomNavigationBar from "./src/components/CustomNavigationBar";
import DetailsScreen from "./src/screens/Details.screen";
import HomeScreen from "./src/screens/Home.screen";
import noteController from "./src/controllers/Note.controller";
import NoteBlock from "./src/screens/NoteBlock.screen";

// Define the props interface for CustomNavigationBar
interface CustomNavigationBarProps {
  navigation: StackNavigationProp<any, any>; // Adjust the types according to your navigation stack
  route: any; // Adjust the types according to your navigation stack
}

// Define the theme for PaperProvider
const theme = {
  ...DefaultTheme,
  // Add any custom theme properties here
};

type IRootStackParamList = {
  Home: undefined;
  NoteBlock: { initialTitle: string; initialText: string };
};

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await noteController.initializeDatabase();
        console.log("Database initialized");
        setIsLoading(false);
        await noteController.getNoteById(1).then((note) => {});
      } catch (error) {
        console.error("Error initializing database", error);
      }
    };
    init();
  }, []);

  return (
    <PaperProvider theme={theme}>
      {isLoading ? (
        <></>
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={
              {
                // header: (props) => (
                //   <CustomNavigationBar
                //     options={undefined}
                //     {...(props as CustomNavigationBarProps)}
                //   />
                // ),
              }
            }
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="NoteBlock"
              component={NoteBlock}
              options={({ navigation }) => ({
                title: "",
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
