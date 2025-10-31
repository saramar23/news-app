import { useFilters } from "../../hooks/useFilters"
import type { Category } from "../../types";

export const CategoryFilter = () => {

    const { filters, updateCategory } = useFilters();
    // , "Sport", "Entertainment", "Environment", "Social", "Security"

    const categories = ["Technology", "Gaming", "Business", "Health", "Science"];
    // Create AllCategory type to fix. Then change useFilters ????
    return (
        <>
            <select name="categorySel" id="categorySel" value={filters.category} onChange={(event) => updateCategory(event.target.value as Category)}>
            <option value="">All Categories</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ) )}
            </select>
        </>
    )
}