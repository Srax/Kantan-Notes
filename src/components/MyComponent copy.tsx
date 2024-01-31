import * as React from "react";
import { StyleSheet } from "react-native";
import { Appbar, FAB, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MyComponent = () => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <Appbar safeAreaInsets={{ bottom }}>
      <Appbar.Action icon="archive" onPress={() => {}} />
      <Appbar.Action icon="email" onPress={() => {}} />
      <Appbar.Action icon="label" onPress={() => {}} />
      <Appbar.Action icon="delete" onPress={() => {}} />
    </Appbar>
  );
};

export default MyComponent;
