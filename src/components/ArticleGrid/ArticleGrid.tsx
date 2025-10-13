import React from "react";
import { ArticleCard } from "../ArticleCard/ArticleCard";
import type { ArticleGridProps } from "../../types";

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, isLoading, error }) => {
    // md lg: medium/large screen size
    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && articles.length === 0 && <p>No articles found.</p>}
            {!isLoading && !error && articles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 news-grid">
                    {articles.map((article) => <ArticleCard key={article.uri} article={article} />)}
                </div>
            )}
        </div>
    );
}