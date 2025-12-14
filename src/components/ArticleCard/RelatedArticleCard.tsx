import React from "react";
import { categoryColors, type ArticleCardProps } from "../../types";
import { getTimeAgo } from "../../utils/getTimeAgo";
import { Link } from "react-router-dom";

// React Functional Component<name> (React FC) 
// ArticleCard {article} needs to match the props inside ArticleCardProps. Destructuring is done to avoid writing props.article
export const RelatedArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    // Combine date and time from API to create a proper datetime string
    const timeAgo = getTimeAgo(article.dateTimePub);
    const imgSource = article.image || "/media/image-placeholder.png";
    const category = article.categories?.[0]?.label?.split('/')?.[1] ?? 'Uncategorized';
    
    // ?? Is called the -nullish coalescing operator- it falls back to "Unknown source" if the title is null or undefined. Not triggered by ""
    const source = article.source?.title ?? 'Unknown Source';
    
    return (
        <article className="block h-[20rem] rounded-md shadow hover:shadow-lg transition overflow-hidden m-6" >
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
                    <h2 className="text-left text-lg font-bold mb-1" 
                        dangerouslySetInnerHTML={{__html: article.title }}>
                    </h2>
                </div>
            </Link>
        </article>
    )
}