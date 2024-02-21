import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import { Text } from "react-native-paper";

import ColorPicker, {
  Swatches,
  Preview,
  OpacitySlider,
  Panel3,
  colorKit,
  returnedResults,
  BrightnessSlider,
} from "reanimated-color-picker";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface ColorPickerModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (color: string) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onDismiss,
  onSelect,
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(visible);
  }, [visible]);

  const customSwatches = new Array(6)
    .fill("#fff")
    .map(() => colorKit.randomRgbColor().hex());

  const selectedColor = useSharedValue(customSwatches[0]);
  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
  }));

  const onColorSelect2 = (color: returnedResults) => {
    "worklet";
    selectedColor.value = color.hex;
  };

  const handleDismiss = () => {
    setShowModal(false);
    onDismiss && onDismiss();
  };

  const handleSelect = () => {
    onSelect && onSelect(selectedColor.value);
    handleDismiss();
  };

  return (
    <Modal
      onRequestClose={() => handleDismiss}
      visible={showModal}
      animationType={"slide"}
      transparent={true}
    >
      <Animated.View style={[styles.container]}>
        <View style={styles.pickerContainer}>
          <ColorPicker
            value={selectedColor.value}
            sliderThickness={25}
            thumbSize={27}
            onChange={onColorSelect2}
          >
            <View style={styles.previewContainer}>
              <Preview style={styles.previewStyle} />
            </View>

            <Panel3 style={styles.panelStyle} renderCenterLine adaptSpectrum />
            <BrightnessSlider style={styles.sliderStyle} />
            <OpacitySlider style={styles.sliderStyle} />

            <Swatches
              style={styles.swatchesContainer}
              swatchStyle={styles.swatchStyle}
              colors={customSwatches}
            />
          </ColorPicker>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleDismiss}>
            <Text style={{ color: "#707070", fontWeight: "bold" }}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: "#007bff" }]}
            onPress={handleSelect}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Select</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  pickerContainer: {
    alignSelf: "center",
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  panelStyle: {
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  previewContainer: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#bebdbe",
  },
  previewStyle: {
    height: 40,
    borderRadius: 14,
  },
  swatchesContainer: {
    borderTopWidth: 1,
    borderColor: "#bebdbe",
    marginTop: 20,
    paddingTop: 20,
    alignItems: "center",
    flexWrap: "nowrap",
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center",
  },
});

export default ColorPickerModal;
