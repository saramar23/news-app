import { useFilters } from "../../hooks/useFilters"
import { CATEGORY_URI_MAP, type Category } from "../../types";

export const CategoryFilter = () => {

    const { filters, updateCategory } = useFilters();
    // , "Sport", "Entertainment", "Environment", "Social", "Security"

    const categories: Category[] = Object.keys(CATEGORY_URI_MAP) as Category[];
    // Create AllCategory type to fix. Then change useFilters ????
    return (
        <>
            <select 
                name="categorySel" 
                id="categorySel" 
                value={filters.category ?? ""} 
                onChange={(event) => updateCategory(event.target.value === "" ? undefined : (event.target.value as Category))}
                className="border-solid rounded-md shadow mx-2 p-1"
            >
                <option value="">All Categories</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ) )}
            </select>
        </>
    )
}