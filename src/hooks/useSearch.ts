// - Create `hooks/useSearch.ts` for search functionality

import { useState } from "react"

export const useSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const updateSearchQuery = (newQuery: string) => {
        // Keeps useSearch encapsulated — nothing outside needs to know about setSearchQuery directly.
        setSearchQuery(newQuery);
    };

    return { searchQuery, updateSearchQuery };
}