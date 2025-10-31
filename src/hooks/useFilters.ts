// - Create `hooks/useFilters.ts` for filter state management

import { useContext } from "react";
import { FilterContext } from "../contexts/FilterContext";
import type { Category, DateRange, SortOptions, Source } from "../types";

export const useFilters = () => {
    const filterCtx = useContext(FilterContext);
        if (!filterCtx) {
            throw new Error ("Error: useFilters must be used within a FilterProvider.");
        }
    const { filters, setFilters } = filterCtx;

    const updateCategory = (newCategory: Category | undefined) => {
        // preState makes a copy of the old filters (to not lose the current dateRange, source, etc..)
        setFilters(prevFilters => {
            return {
                ...prevFilters, category: newCategory
            }
        });
    }

    const updateDateRange = (newDateRange: DateRange | undefined) => {
        setFilters(prevState => {
            return {
                ...prevState, dateRange: newDateRange
            }
        });
    }

    const updateSource = (newSource: Source | undefined) => {
        setFilters(prevState => {
            return {
                ...prevState, source: newSource
            }
        });
    }

    const updateSortOptions = (newSortOptions: SortOptions | undefined) => {
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