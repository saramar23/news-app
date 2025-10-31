import { createContext, useState } from "react";
import type { AppState, FilterContextType } from "../types";

/* It's like a filter "storage" that lets any component in my app to read and update those filters without passing props to each layer.
* In short, a global storage accessible anywhere.
*/ 

/** Creates a Filter Context "empty box" that can later be used in different components. 
 * It expects an object that matches the FilterContextType {filters, setFilters}
 */
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

/** It fills the "box" with real data 
 * children: components inside the context provider, they get access to the data (filters in this case)
 *
 */
export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [filters, setFilters] = useState<AppState["filters"]>({
        // Sets the initial state
        category: undefined,
        dateRange: undefined,
        source: undefined,
        sortOption: undefined,
    });

    return (
        <FilterContext.Provider value={{filters, setFilters}}> {children} </FilterContext.Provider>
    )
}