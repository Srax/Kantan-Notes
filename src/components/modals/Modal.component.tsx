import React from "react";
import { Modal as PModal, Portal, Button } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";

interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  style?: any;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onDismiss,
  children,
  style,
}) => {
  return (
    <Portal>
      <PModal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={style}
        theme={{
          colors: {
            backdrop: "transparent",
          },
        }}
      >
        {children}
      </PModal>
    </Portal>
  );
};

export default Modal;
