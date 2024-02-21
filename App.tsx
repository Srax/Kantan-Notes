import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import {
  DefaultTheme,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import HomeScreen from "./src/screens/Home.screen";
import noteController from "./src/controllers/Note.controller";
import NoteBlock from "./src/screens/NoteBlock.screen";
import { Image, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AgreementScreen from "./src/screens/Agreement.screen";
import { RootStackParamList } from "./src/types/Routes.type";
import * as SplashScreen from "expo-splash-screen";

import RichTextEditorTest from "./src/screens/Rich.screen";
import { RichEditorScreen } from "./src/screens/RichTextEditor";
import { Preview } from "./src/screens/Preview.screen";

import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

// Define the theme for PaperProvider
const theme = {
  ...DefaultTheme,
  // Add any custom theme properties here
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAgreement, setShowAgreement] = useState(true);

  const init = async () => {
    setIsLoading(true);
    try {
      await SplashScreen.preventAutoHideAsync(); // Prevent auto hiding of splash screen
      await checkAgreement();
      await noteController.initializeDatabase();
    } catch (error) {
      console.error("Error initializing", error);
    } finally {
      setIsLoading(false);
      SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    init();
  }, []);

  const checkAgreement = async () => {
    const hasAccepted = await AsyncStorage.getItem("v1/agreementAccepted");
    setShowAgreement(hasAccepted !== "true");
  };

  if (isLoading) {
    return null; // You can replace this with a custom loading component if needed
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={showAgreement ? "Agreement" : "Rich"}
          screenOptions={{
            title: "Notes",
            // header: (props) => (
            //   <CustomNavigationBar
            //     options={undefined}
            //     {...(props as CustomNavigationBarProps)}
            //   />
            // ),
          }}
        >
          {showAgreement ? (
            <Stack.Screen
              name="Agreement"
              component={AgreementScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          ) : (
            <></>
          )}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="NoteBlock"
            component={NoteBlock}
            options={() => ({
              title: "",
            })}
          />
          <Stack.Screen name="Rich" component={RichEditorScreen} />
          <Stack.Screen name="Preview" component={Preview} />
          {/* <Stack.Screen name="Rich" component={RichTextEditorTest} /> */}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
