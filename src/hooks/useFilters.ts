// - Create `hooks/useFilters.ts` for filter state management

import { useCallback, useContext } from "react";
import { FilterContext } from "../contexts/FilterContext";
import type { Category, DateRange, SortOptions, Source } from "../types";

export const useFilters = () => {
    const filterCtx = useContext(FilterContext);
        if (!filterCtx) {
            throw new Error ("Error: useFilters must be used within a FilterProvider.");
        }
    const { filters, setFilters } = filterCtx;

    const updateCategory = useCallback((newCategory: Category | undefined) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            category: newCategory,
        }));
    }, []);

    const updateDateRange = useCallback((newDateRange: DateRange | undefined) => {
        setFilters((prevState) => ({
            ...prevState,
            dateRange: newDateRange,
        }));
    }, []);

    const updateSource = useCallback((newSource: Source | undefined) => {
        setFilters((prevState) => ({
            ...prevState,
            source: newSource,
        }));
    }, []);

    const updateSortOptions = useCallback((newSortOptions: SortOptions | undefined) => {
        setFilters((prevState) => ({
            ...prevState,
            sortOption: newSortOptions,
        }));
    }, []);
    // return the current filters and the functions that update it, ofc
    return { filters, updateCategory, updateDateRange, updateSource, updateSortOptions };
}