import React from "react";
import { type ArticleCardProps } from "../../types";
import { ArticleCard } from "./ArticleCard";

export const RelatedArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    
    return (
        <ArticleCard variant="related" article={article} />
    )
}