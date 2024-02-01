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
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AgreementScreen from "./src/screens/Agreement.screen";

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
  const [showAgreement, setShowAgreement] = useState(false);

  const init = async () => {
    try {
      await checkAgreement();
      setIsLoading(true);
      await noteController.initializeDatabase();
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const checkAgreement = async () => {
    const hasAccepted = await AsyncStorage.getItem("agreementAccepted");
    setShowAgreement(hasAccepted !== "true");
  };

  return (
    <PaperProvider theme={theme}>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        ></View>
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
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
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen name="Home" component={HomeScreen} />
            )}
            <Stack.Screen
              name="NoteBlock"
              component={NoteBlock}
              options={({ navigation }) => ({
                title: "",
              })}
            />
            <Stack.Screen
              name="FirstTime"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
