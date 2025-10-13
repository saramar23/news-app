import React, { useState } from "react";
import { ArticleGrid } from "../ArticleGrid/ArticleGrid";
import { useArticles } from "../../hooks/useArticles";

export const HomePage: React.FC = () => {
    const [ filters, setFilters ] = useState({});
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ page, setPage ] = useState(1);
    const { articles, isLoading, error } = useArticles(filters, searchQuery, page);

    return (
        <div className="px-4 py-6">
            <ArticleGrid articles={articles} isLoading={isLoading} error={error}></ArticleGrid>
        </div>
    )
}