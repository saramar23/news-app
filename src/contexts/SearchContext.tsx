import { createContext, useState } from "react";
import type { SearchContextType } from "../types";

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({children}: {children: React.ReactNode}) => {
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    return (
        <SearchContext.Provider value={{searchQuery, updateSearchQuery: setSearchQuery}} > {children} </SearchContext.Provider>
    )
}