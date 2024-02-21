import React, { useState } from "react";
import { View } from "react-native";
import { Modal as PaperModal, Portal, Button } from "react-native-paper";

type ModalChildrenProps = {
  onClose: () => void;
  children: JSX.Element;
  // ...other props
};

const Modal: React.FC<ModalChildrenProps> = ({ onClose, children }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <View>
      {/* Button or other trigger to open the modal */}
      <Button onPress={showModal}>Open Modal</Button>

      <Portal>
        <PaperModal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <View style={{ padding: 20 }}>
            {children}
            <Button onPress={hideModal}>Close</Button>
          </View>
        </PaperModal>
      </Portal>
    </View>
  );
};

export default Modal;
