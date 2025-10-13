// - Create `hooks/useFilters.ts` for filter state management

import { useState } from "react";
import type { AppState, Category, DateRange, SortOptions, Source } from "../types";

export const useFilters = () => {
    const [filters, setFilters] = useState<AppState["filters"]>({
        // Sets the value of the filters to null as initial state
        category: null,
        dateRange: null,
        source: null,
        sortOption: null,
    });
    
    const updateCategory = (newCategory: Category | null) => {
        // preState makes a copy of the old filters (to not lose the current dateRange, source, etc..)
        setFilters(prevState => {
            return {
                // only updates Category with a new one :)
                ...prevState, category: newCategory
            }
        });
    }

    const updateDateRange = (newDateRange: DateRange | null) => {
        setFilters(prevState => {
            return {
                ...prevState, dateRange: newDateRange
            }
        });
    }

    const updateSource = (newSource: Source | null) => {
        setFilters(prevState => {
            return {
                ...prevState, source: newSource
            }
        });
    }

    const updateSortOptions = (newSortOptions: SortOptions | null) => {
        //React gives me the previous sortoption filter and I update it to a new one
        setFilters(prevState => {
            return {
        // The ...prevState part copies everything that was already there (category, dateRange, source)
        // Then sortOption: newSortOptions replaces just that one field with the new value.
                ...prevState, sortOption: newSortOptions
            }
        });
    }
    // return the current filters and the functions that update it, ofc
    return { filters, updateCategory, updateDateRange, updateSource, updateSortOptions };
}