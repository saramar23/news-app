import { useNavigate } from "react-router-dom";
import { useFilters } from "../../hooks/useFilters"
import { CATEGORY_URI_MAP, type Category } from "../../types";

export const CategoryFilter = () => {
    const navigate = useNavigate();
    const { filters } = useFilters();
    const categories: Category[] = Object.keys(CATEGORY_URI_MAP) as Category[];
   
    return (
        <>
            <select 
                name="categorySel" 
                id="categorySel" 
                value={filters.category ?? ""} 
                onChange={(event) => {
                    const selectedValue = event.target.value;
                    if (selectedValue === "") {
                        navigate("/");
                    } else {
                        navigate(`/${(selectedValue as Category).toLowerCase()}`);
                    }
                }}
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