import React, { useEffect, useState } from "react";
import { ArticleGrid } from "../ArticleGrid/ArticleGrid";
import { useArticles } from "../../hooks/useArticles";
import { useFilters } from "../../hooks/useFilters";
import { useSearch } from "../../hooks/useSearch";
import { Pagination } from "./Pagination";
import { Header } from "../Header/Header";
import { CategoryFilter } from "../Filters/CategoryFilter";
import { DateRangeFilter } from "../Filters/DateRangeFilter";
import { TodaysPickPreview } from "../ArticleDetail/Sidebar/TodaysPickPreview";

export const HomePage: React.FC = () => {
    const { filters } = useFilters();
    const { searchQuery } = useSearch();
    const [ page, setPage ] = useState(1);
    const pageSize = 6;
    const { articles, isLoading, error, totalResults} = useArticles(filters, searchQuery, page, pageSize);
    const MAX_TOTAL_PAGES = 12;
    const totalPages = Math.min(Math.ceil(totalResults / pageSize), MAX_TOTAL_PAGES);

    useEffect(() => {
        setPage(1); // Reset to pag 1 every time searchQuery or filters change
    }, [searchQuery, filters]);

    return (
        <div className="">
            <Header />
            <div className="pt-20 pb-6">
                <h1 className="text-left mb-4">Today's Pick</h1>
                <TodaysPickPreview />
            </div>
            <div className="flex justify-between flex-wrap gap-4 mt-2">
                <h2 className="text-xl font-semibold">Latest News</h2>
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