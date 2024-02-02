import React from "react";
import { Appbar, Searchbar } from "react-native-paper";
import Searchbar from "./SearchBar.component";

interface CustomHeaderProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  children,
  searchQuery,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <Appbar.Header>
      <Searchbar value={searchQuery} onChangeText={onSearchChange} />
      {children}
    </Appbar.Header>
  );
};

export default CustomHeader;
