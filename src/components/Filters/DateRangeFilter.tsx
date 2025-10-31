import { useFilters } from "../../hooks/useFilters";
import type { DateRange } from "../../types";

export const DateRangeFilter = () => {

    const { filters, updateDateRange } = useFilters();

    const ranges: DateRange[] = ["Today", "This Week", "This Month"];

    return (
        <>
            <select name="rangeSelection" id="rangeSelection" value={filters.dateRange} onChange={(event) => updateDateRange(event.target.value as DateRange)}>
                <option value="">Today</option>
                {ranges.map((range, index) => (
                    <option key={index} value={range}> {range} </option>
                ))}
            </select>
        </>
    )
}