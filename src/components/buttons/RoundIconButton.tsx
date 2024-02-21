import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { IconButton, IconButtonProps } from "react-native-paper";

interface Props {
  icon: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;
  containerColor?: string;
  iconColor?: string;
}

const RoundIconButton: React.FC<Props> = ({
  icon,
  onPress,
  style,
  size,
  containerColor,
  iconColor,
}) => {
  return (
    <IconButton
      style={style ?? stl.btn}
      icon={icon}
      size={size ?? 40}
      mode={"contained-tonal"}
      onPress={onPress}
      containerColor={containerColor ?? "gray"}
      iconColor={iconColor ?? "#ffffff"}
    />
  );
};

const stl = StyleSheet.create({
  btn: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default RoundIconButton;
