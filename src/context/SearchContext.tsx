import React, { createContext, useState } from "react";

interface SearchContectType {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchContext = createContext<SearchContectType | undefined>(
  undefined
);

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const contectValue = {
    searchValue,
    setSearchValue,
  };

	return <SearchContext.Provider value={contectValue}>{children}</SearchContext.Provider>
};
