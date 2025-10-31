// - Create `hooks/useSearch.ts` for search functionality

import { useContext } from "react";
import { SearchContext } from "../contexts/SearchContext";

export const useSearch = () => {
    const context = useContext(SearchContext);

    if (!context) throw new Error("useSearch error");
    return context;
}