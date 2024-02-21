import { XMath } from "@wxik/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  Button,
  Keyboard,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import {
  FONT_SIZE,
  IconRecord,
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import ColorPickerModal from "../components/modals/ColorPickerModal.component";
import Modal from "../components/modals/Modal.component";
import WebView from "react-native-webview";

enum ToolBars {
  default,
  fontBar,
}

interface MenuIconProps {
  icon: IconSource;
  size?: number;
  color?: string;
}

const MenuIcon: React.FC<MenuIconProps> = ({ icon, size, color }) => {
  return <IconButton icon={icon} size={size || 20} iconColor={color} />;
};

const INITIAL_CONTENT = "<p>Start writing your awesome content here!</p>";

const RichTextEditorTest = () => {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [currentToolBar, setCurrentToolBar] = useState<ToolBars>(
    ToolBars.default
  );

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

  useEffect(() => {
    console.log("asdasdadad", selectedColor);
  }, [selectedColor]);

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

  // const fontSizeOptions = [
  //   { label: "H1", size: FONT_SIZE.H1 },
  //   { label: "H2", size: FONT_SIZE.H2 },
  //   { label: "Aa", size: FONT_SIZE.P }, // Assuming FONT_SIZE.P is the default paragraph size
  // ];

  const handleContentChange = (html: any) => {
    const linkRegex = /((http|https):\/\/[^\s]+)/g;

    // Replace links with hyperlinks in the Rich Text Editor
    const updatedContent = html.replace(
      linkRegex,
      '<a href="$1" style="color: blue; text-decoration: underline;" target="_blank">$1</a>'
    );

    setContent(updatedContent);
  };

  useEffect(() => {
    console.log(content);
  }, [content]);

  const handleSaveButtonClick = () => {
    // Save the HTML content to your server or local storage
    console.log("Content:", content);
  };

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollRef.current!.scrollTo({ y: scrollY - 30, animated: true });
  }, []);

  const handleFontSize = useCallback(() => {
    // console.log("font");
    // 1=  10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px, 7 = 48px;
    let size = [1, 2, 3, 4, 5, 6, 7];
    editor.current?.setFontSize(3 as FONT_SIZE);
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
        <RichEditor
          ref={editor}
          initialContentHTML={INITIAL_CONTENT}
          onLink={() => console.log("clicked")}
          onChange={handleContentChange}
          onCursorPosition={handleCursorPosition}
        />
        {renderToolBar()}
        <Button title="Save" onPress={handleSaveButtonClick} />
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
        {/* <Text style={{ margin: 10, fontSize: 16 }}>Rendered HTML:</Text>
        <Text style={{ padding: 10, backgroundColor: "#ddd" }}>{content}</Text> */}
      </ScrollView>
      <WebView
        useWebKit={true}
        scrollEnabled={false}
        hideKeyboardAccessoryView={true}
        keyboardDisplayRequiresUserAction={false}
        originWhitelist={["*"]}
        dataDetectorTypes={"none"}
        domStorageEnabled={false}
        bounces={false}
        javaScriptEnabled={true}
        source={{ content }}
      />
    </SafeAreaView>
  );
};

export default RichTextEditorTest;
