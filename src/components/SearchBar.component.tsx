import React from "react";
import { Searchbar as PaperSearchBar } from "react-native-paper";

interface SearchbarProps {
  value: string;
  placeholder?: string;
  onChange: (query: string) => void;
  onClear: () => void;
}

const Searchbar: React.FC<SearchbarProps> = ({
  value,
  placeholder,
  onChange,
  onClear,
}) => {
  const handleSearchChange = (query: string) => {
    onChange(query);
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <PaperSearchBar
      placeholder={placeholder}
      onChangeText={handleSearchChange}
      value={value}
      icon={"note-search-outline"}
      onClearIconPress={handleClear}
      theme={{ colors: { primary: "black", elevation: "none" } }}
      style={{ padding: 0 }}
    />
  );
};

export default Searchbar;
