import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import * as Linking from "expo-linking";
import config from "../config/config";

const AgreementScreen = ({ navigation }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    await AsyncStorage.setItem("v1/agreementAccepted", "true");
    setAccepted(true);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.middleContainer}>
        {/* MIDDLE VIEW TO BE SHOWN IN THE CENTER */}
        <Text variant={"displayLarge"}>Welcome</Text>
      </View>
      <View style={styles.bottomContainer}>
        {/* BOTTOM VIEW TO BE SHOWN AT THE BOTTOM */}
        <Button
          mode={"contained-tonal"}
          onPress={handleAccept}
          disabled={accepted}
          style={styles.button}
        >
          Agree
        </Button>
        <Text variant={"labelSmall"} style={{ textAlign: "center" }}>
          By tapping Agree you agree to our{" "}
          <Text
            style={{ fontWeight: "bold" }}
            onPress={() => Linking.openURL(config.url.termsAnConditions)}
          >
            Terms & Conditions
          </Text>{" "}
          and{" "}
          <Text
            style={{ fontWeight: "bold" }}
            onPress={() => Linking.openURL(config.url.privacyPolicy)}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  middleContainer: {
    // Center the middle view both horizontally and vertically
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // Occupy remaining space above bottom view
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0, // Place at the bottom of the screen
    left: 0, // Align left
    right: 0, // Align right
    // Add padding for spacing around content
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  button: {
    marginBottom: 40,
  },
});

export default AgreementScreen;
