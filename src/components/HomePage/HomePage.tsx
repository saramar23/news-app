import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleGrid } from "../ArticleGrid/ArticleGrid";
import { useArticles } from "../../hooks/useArticles";
import { useFilters } from "../../hooks/useFilters";
import { useSearch } from "../../hooks/useSearch";
import { Pagination } from "./Pagination";
import { CategoryFilter } from "../Filters/CategoryFilter";
import { DateRangeFilter } from "../Filters/DateRangeFilter";
import { TodaysPickPreview } from "../ArticleDetail/Sidebar/TodaysPickPreview";
import { CATEGORY_URI_MAP, type Category } from "../../types";

export const HomePage: React.FC = () => {
    const { category: categoryParam } = useParams<{ category?: string }>();
    const navigate = useNavigate();
    const { filters, updateCategory } = useFilters();
    const { searchQuery } = useSearch();
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const { articles, isLoading, error, totalResults } = useArticles(filters, searchQuery, page, pageSize);
    const MAX_TOTAL_PAGES = 12;
    const totalPages = Math.min(Math.ceil(totalResults / pageSize), MAX_TOTAL_PAGES);

    useEffect(() => {
        if (categoryParam?.toLowerCase() === "article") {
            navigate("/", { replace: true });
            return;
        }
        if (!categoryParam) {
            updateCategory(undefined);
            return;
        }
        const match = (Object.keys(CATEGORY_URI_MAP) as Category[]).find(
            (cat) => cat.toLowerCase() === categoryParam.toLowerCase()
        );
        updateCategory(match);
    }, [categoryParam, navigate, updateCategory]);

    useEffect(() => {
        setPage(1); // Reset to pag 1 every time searchQuery or filters change
    }, [searchQuery, filters.category, filters.dateRange, filters.source, filters.sortOption]);

    return (
        <div className="">
            <div className="pt-20 pb-6">
                <h2 className="text-left font-semibold mb-4">Today's Pick</h2>
                <TodaysPickPreview />
            </div>
            <div className="flex justify-between flex-wrap gap-4 mt-2">
                <h2 className="font-semibold" id="latest-news">Latest News</h2>
                <div className="flex justify-around gap-4">
                    <CategoryFilter />
                    <DateRangeFilter />
                </div>
            </div>
            <ArticleGrid articles={articles} isLoading={isLoading} error={error} />
            {totalPages > 1 && (
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            )}
        </div>
    )
}