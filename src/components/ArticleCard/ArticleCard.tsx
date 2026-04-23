import React from "react";
import { categoryColors, type ArticleCardProps } from "../../types";
import { getArticleDisplayFields } from "../../utils/articleDisplay";
import { highlightSearch, HighlightedText } from "../../utils/searchHighlight";
import { useSearch } from "../../hooks/useSearch";
import { Link } from "react-router-dom";

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const { searchQuery } = useSearch();
    
    const { timeAgo, imgSource, category, source } =
        getArticleDisplayFields(article);

    const titleSegments = article.title
        ? highlightSearch({ text: article.title, query: searchQuery })
        : [{ text: "No match found", highlight: false }];
    const bodySegments = article.body
        ? highlightSearch({ text: article.body, query: searchQuery })
        : [{ text: "No content available", highlight: false }];

    return (
        <article className="block h-[35rem] rounded-md shadow hover:shadow-lg transition overflow-hidden" >
            <Link to={`/article/${article.uri}`}>
                <div className="h-1/2" >
                    <img src={imgSource} alt={article.title} className="w-full h-full object-cover news-image"/>
                </div>
                <div className="h-1/2 p-4 flex flex-col justify-start text-left">
                    <div className="text-xs text-gray-500 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[category] || "text-gray-600 bg-gray-200"}`}>
                        {category}
                    </span> •
                    <span className="m-1">{source} </span>•
                    <span className="m-1">{timeAgo}</span>
                    </div>
                    <h3 className="text-left font-bold p-2 mb-1">
                        <HighlightedText segments={titleSegments} />
                    </h3>
                    <p className="text-left p-2 overflow-hidden line-clamp-5 break-words">
                        <HighlightedText segments={bodySegments} />
                    </p>
                </div>
            </Link>
        </article>
    )
}