import React, { useRef, useState } from "react";
import { FlatList, SafeAreaView, Text, TextInput, Button } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const INITIAL_CONTENT = "<p>Start writing your awesome content here!</p>";

const App = () => {
  const [content, setContent] = useState(INITIAL_CONTENT);

  const editorRef = useRef(null);

  const handleContentChange = (html) => {
    setContent(html);
  };

  const handleSaveButtonClick = () => {
    // Save the HTML content to your server or local storage
    console.log("Content:", content);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RichEditor
        ref={editorRef}
        initialContentHTML={INITIAL_CONTENT}
        onChange={handleContentChange}
      />
      <RichToolbar editor={editorRef} />
      <Button title="Save" onPress={handleSaveButtonClick} />
      <Text style={{ margin: 10, fontSize: 16 }}>Rendered HTML:</Text>
      <Text style={{ padding: 10, backgroundColor: "#ddd" }}>{content}</Text>
    </SafeAreaView>
  );
};

export default App;
