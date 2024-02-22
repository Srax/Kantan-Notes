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
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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
  textBar,
  formatTitleBar,
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
    ToolBars.textBar
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

  const openColorPickerModal = () => setColorPickerModalVisible(true);
  const closeColorPickerModal = () => setColorPickerModalVisible(false);

  const openLinkPickerModal = () => setLinkPickerModalVisible(true);
  const closeLinkPickerModal = () => setLinkPickerModalVisible(false);

  const handleColorSelect = (color: string) => {
    editor.current?.setForeColor(color);
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

  const handleForeColor = useCallback(() => {
    openColorPickerModal();
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
      // case ToolBars.default:
      //   return (
      //     <RichToolbar
      //       style={styles.richBar}
      //       flatContainerStyle={styles.flatStyle}
      //       selectedIconTint={"#2095F2"}
      //       disabledIconTint={"#bfbfbf"}
      //       editor={editor}
      //       actions={[actions.keyboard, "fontMenu"]}
      //       iconMap={{
      //         [actions.keyboard]: ({ tintColor }: IconRecord) => (
      //           <MenuIcon icon={"keyboard-outline"} color={tintColor} />
      //         ),
      //         fontMenu: ({ tintColor }: IconRecord) => (
      //           <Text
      //             style={[styles.tib, { color: tintColor, fontWeight: "bold" }]}
      //           >
      //             Aa
      //           </Text>
      //         ),
      //       }}
      //       fontMenu={() => setCurrentToolBar(ToolBars.textBar)}
      //     />
      //   );
      case ToolBars.textBar:
        return (
          <RichToolbar
            style={styles.richBar}
            flatContainerStyle={styles.flatStyle}
            selectedIconTint={"#2095F2"}
            disabledIconTint={"#bfbfbf"}
            editor={editor}
            actions={[
              "formatTitle",
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.setStrikethrough,
              actions.removeFormat,
              actions.setSuperscript,
              actions.setSubscript,
              actions.foreColor,
            ]}
            iconMap={{
              formatTitle: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-title"} color={tintColor} />
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
              [actions.setStrikethrough]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-strikethrough"} color={tintColor} />
              ),
              [actions.foreColor]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"palette-outline"} color={tintColor} />
              ),
              [actions.removeFormat]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-clear"} color={tintColor} />
              ),
              close: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"close"} color={tintColor} />
              ),
            }}
            formatTitle={() => setCurrentToolBar(ToolBars.formatTitleBar)}
            foreColor={handleForeColor}
          />
        );
      case ToolBars.formatTitleBar:
        return (
          <RichToolbar
            style={styles.richBar}
            flatContainerStyle={styles.flatStyle}
            selectedIconTint={"#2095F2"}
            disabledIconTint={"#bfbfbf"}
            editor={editor}
            actions={[
              actions.heading1,
              actions.heading2,
              actions.heading3,
              actions.heading4,
              actions.heading5,
              actions.heading6,
              actions.setParagraph,
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
              [actions.heading4]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-header-4"} color={tintColor} />
              ),
              [actions.heading5]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-header-5"} color={tintColor} />
              ),
              [actions.heading6]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-header-6"} color={tintColor} />
              ),
              [actions.setParagraph]: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"format-paragraph"} color={tintColor} />
              ),
              close: ({ tintColor }: IconRecord) => (
                <MenuIcon icon={"close"} color={tintColor} />
              ),
            }}
            close={() => setCurrentToolBar(ToolBars.textBar)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ColorPickerModal
        visible={colorPickerModalVisible}
        onSelect={handleColorSelect}
        onDismiss={closeColorPickerModal}
      />
      <Modal visible={linkPickerModalVisible} onDismiss={closeLinkPickerModal}>
        <Text>Test</Text>
      </Modal>
      <ScrollView
        style={[styles.scroll]}
        keyboardDismissMode={"none"}
        ref={scrollRef}
        nestedScrollEnabled={true}
        scrollEventThrottle={20}
      >
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <RichToolbar
              style={[styles.richBar]}
              flatContainerStyle={styles.flatStyle}
              editor={editor}
              // disabled={disabled}
              // iconTint={color}
              selectedIconTint={"#2095F2"}
              disabledIconTint={"#bfbfbf"}
              // onPressAddImage={onPressAddImage}
              // onInsertLink={onInsertLink}
              // iconSize={24}
              // iconGap={10}
              actions={[
                actions.undo,
                actions.redo,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.insertOrderedList,
                actions.insertBulletsList,
                actions.checkboxList,
                actions.outdent,
                actions.indent,
                // actions.insertVideo,
                // actions.insertImage,
                // actions.insertLink,
                actions.blockquote,
                actions.code,
                actions.line,
              ]} // default defaultActions
              iconMap={{
                [actions.undo]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"undo"} color={tintColor} />
                ),
                [actions.redo]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"redo"} color={tintColor} />
                ),
                [actions.alignLeft]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"format-align-left"} color={tintColor} />
                ),
                [actions.alignCenter]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"format-align-center"} color={tintColor} />
                ),
                [actions.alignRight]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"format-align-right"} color={tintColor} />
                ),
                [actions.insertOrderedList]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"format-list-numbered"} color={tintColor} />
                ),
                [actions.insertBulletsList]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"format-list-bulleted"} color={tintColor} />
                ),
                [actions.checkboxList]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"format-list-checkbox"} color={tintColor} />
                ),
                [actions.indent]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"format-indent-increase"} color={tintColor} />
                ),
                [actions.outdent]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"format-indent-decrease"} color={tintColor} />
                ),
                [actions.insertImage]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"image"} color={tintColor} />
                ),
                [actions.insertVideo]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"video"} color={tintColor} />
                ),
                [actions.insertLink]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"link"} color={tintColor} />
                ),
                [actions.blockquote]: ({ tintColor }: IconRecord) => (
                  <MenuIcon
                    icon={"format-quote-open-outline"}
                    color={tintColor}
                  />
                ),
                [actions.code]: ({ tintColor }: IconRecord) => (
                  <MenuIcon icon={"code-tags"} color={tintColor} />
                ),
              }}
              // insertVideo={handleInsertVideo}
              // fontSize={handleFontSize}
              // foreColor={handleForeColor}
              // hiliteColor={handleHaliteColor}
            />
            <RichEditor
              ref={editor}
              initialFocus={false}
              firstFocusEnd={false}
              style={styles.rich}
              useContainer={true}
              initialHeight={400}
              enterKeyHint={"done"}
              placeholder={"Write your note here"}
              initialContentHTML={note?.getContent()}
              pasteAsPlainText={true}
              onLink={() => console.log("clicked")}
              onChange={handleContentChange}
              onCursorPosition={handleCursorPosition}
            />
          </>
        )}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {isLoading ? <></> : <>{renderToolBar()}</>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    backgroundColor: "#fff",
  },
  richBar: {
    borderColor: "#efefef",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  flatStyle: {
    paddingHorizontal: 12,
  },
  rich: {
    minHeight: 300,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e3e3e3",
  },
  tib: {
    textAlign: "center",
    color: "#515156",
  },
});

export default Editor;
