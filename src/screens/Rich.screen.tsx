import { XMath } from "@wxik/core";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  Button,
  Keyboard,
  View,
  ToastAndroid,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar, IconButton } from "react-native-paper";
import {
  FONT_SIZE,
  IconRecord,
  RichEditor,
  RichToolbar,
  actions,
  getContentCSS,
} from "react-native-pell-rich-editor";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import ColorPickerModal from "../components/modals/ColorPickerModal.component";
import Modal from "../components/modals/Modal.component";
import WebView from "react-native-webview";

import { RootStackParamList } from "../types/Routes.type";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import RichNote from "../types/Note.type";
import richNoteController from "../controllers/Note.controller";

enum ToolBars {
  default,
  fontBar,
}

interface MenuIconProps {
  icon: IconSource;
  size?: number;
  color?: string;
}

interface IProps {
  route: RouteProp<RootStackParamList, "Edit">;
  navigation: NavigationProp<RootStackParamList, "Edit">;
}

const MenuIcon: React.FC<MenuIconProps> = ({ icon, size, color }) => {
  return <IconButton icon={icon} size={size || 20} iconColor={color} />;
};

const Editor: React.FC<IProps> = ({ route, navigation }) => {
  const [content, setContent] = useState("");
  const [currentToolBar, setCurrentToolBar] = useState<ToolBars>(
    ToolBars.default
  );
  const [note, setNote] = useState<RichNote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { noteId, autoFocus } = route.params;

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      if (noteId) {
        const fetched = await richNoteController.getNoteById(noteId);
        if (fetched) {
          setNote(fetched);
          setContent(fetched.getContent());
        }
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const [colorPickerModalVisible, setColorPickerModalVisible] =
    useState<boolean>(false);
  const [linkPickerModalVisible, setLinkPickerModalVisible] =
    useState<boolean>(false);

  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  const openColorPickerModal = () => setColorPickerModalVisible(true);
  const closeColorPickerModal = () => setColorPickerModalVisible(false);

  const openLinkPickerModal = () => setLinkPickerModalVisible(true);
  const closeLinkPickerModal = () => setLinkPickerModalVisible(false);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    closeColorPickerModal(); // Close the modal after selecting the color
  };

  const scrollRef = useRef<ScrollView>(null);
  const editor = useRef<RichEditor>(null);

  const onKeyHide = useCallback(() => {}, []);
  const onKeyShow = useCallback(() => {
    TextInput.State.currentlyFocusedInput();
  }, []);

  useEffect(() => {
    let listener = [
      Keyboard.addListener("keyboardDidShow", onKeyShow),
      Keyboard.addListener("keyboardDidHide", onKeyHide),
    ];
    return () => {
      listener.forEach((it) => it.remove());
    };
  }, [onKeyHide, onKeyShow]);

  const showToast = (text: string) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  const handleContentChange = (html: any) => {
    setContent(html);
  };

  const handleSave = async () => {
    try {
      if (!content) {
        showToast("Empty note discarded");
        return;
      }
      if (!note) {
        let _n = new RichNote(-1, content, getContentCSS(), 0, 0);
        await richNoteController.createNote(_n);
        showToast("Note created");
        return;
      }

      let _n: RichNote = note;
      _n.setContent(content);
      _n.setCss(getContentCSS());
      await richNoteController.updateNote(_n);
      showToast("Note updated");
      return;
    } catch (error) {
      console.error(error);
      showToast("Something went wrong");
    } finally {
      Keyboard.dismiss();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={"Edit"} />
          {/* <Appbar.Action icon="note-edit-outline" onPress={() => {}} />
          <Appbar.Action icon="dots-vertical" onPress={() => {}} /> */}
        </Appbar.Header>
      ),
    });

    const unsubscribe = navigation.addListener("beforeRemove", () => {
      handleSave();
    });
    return unsubscribe; // Cleanup function to remove the listener
  }, [navigation, content, note]);

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollRef.current!.scrollTo({ y: scrollY - 30, animated: true });
  }, []);

  const onLinkDone = useCallback(
    ({ title, url }: { title?: string; url?: string }) => {
      if (title && url) {
        editor.current?.insertLink(title, url);
      }
    },
    []
  );

  const renderToolBar = () => {
    switch (currentToolBar) {
      case ToolBars.default:
        return (
          <RichToolbar
            editor={editor}
            actions={[actions.keyboard, "fontMenu"]}
            iconMap={{
              [actions.keyboard]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"keyboard-outline"} color={tintColor} />
              ),
              fontMenu: ({ tintColor }: IconRecord) => (
                <MenuIcon color={tintColor} icon={"format-font"} />
              ),
            }}
            fontMenu={() => setCurrentToolBar(ToolBars.fontBar)}
          />
        );
      case ToolBars.fontBar:
        return (
          <RichToolbar
            editor={editor}
            actions={[
              actions.heading1,
              actions.heading2,
              actions.heading3,
              actions.setParagraph,
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.removeFormat,
              actions.setTextColor,
              "close",
            ]}
            iconMap={{
              [actions.heading1]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-header-1"} color={tintColor} />
              ),
              [actions.heading2]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-header-2"} color={tintColor} />
              ),
              [actions.heading3]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-header-3"} color={tintColor} />
              ),

              [actions.setParagraph]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-paragraph"} color={tintColor} />
              ),
              [actions.setBold]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-bold"} color={tintColor} />
              ),
              [actions.setItalic]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-italic"} color={tintColor} />
              ),
              [actions.setUnderline]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-underline"} color={tintColor} />
              ),
              [actions.setTextColor]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"palette-outline"} color={tintColor} />
              ),
              [actions.removeFormat]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-clear"} color={tintColor} />
              ),
              close: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"close"} color={tintColor} />
              ),
            }}
            close={() => setCurrentToolBar(ToolBars.default)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        // style={[styles.scroll, dark && styles.scrollDark]}
        keyboardDismissMode={"none"}
        ref={scrollRef}
        nestedScrollEnabled={true}
        scrollEventThrottle={20}
      >
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <RichEditor
              ref={editor}
              initialFocus={true}
              initialContentHTML={note?.getContent()}
              onLink={() => console.log("clicked")}
              onChange={handleContentChange}
              onCursorPosition={handleCursorPosition}
            />
            {renderToolBar()}
          </>
        )}
        <Button title="Color" onPress={openColorPickerModal} />
        <Button title="Link" onPress={openLinkPickerModal} />

        <ColorPickerModal
          visible={colorPickerModalVisible}
          onSelect={handleColorSelect}
          onDismiss={closeColorPickerModal}
        />
        <Modal
          visible={linkPickerModalVisible}
          onDismiss={closeLinkPickerModal}
        >
          <Text>Test</Text>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Editor;
