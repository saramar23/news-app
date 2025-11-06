import { useFilters } from "../../hooks/useFilters";
import type { DateRange } from "../../types";

export const DateRangeFilter = () => {

    const { filters, updateDateRange } = useFilters();

    const ranges: DateRange[] = ["Today", "This Week", "This Month"];

    return (
        <>
            <select 
                name="rangeSelection" 
                id="rangeSelection" 
                value={filters.dateRange} 
                onChange={(event) => updateDateRange(event.target.value as DateRange)}
                className="rounded-md shadow mx-2 p-1"
            >
                <option value="">All time</option>
                {ranges.map((range, index) => (
                    <option key={index} value={range}> {range} </option>
                ))}
            </select>
        </>
    )
}