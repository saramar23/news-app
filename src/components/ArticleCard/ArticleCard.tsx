import React from "react";
import type { ArticleCardProps } from "../../types";
import { getTimeAgo } from "../../utils/getTimeAgo";

// React Functional Component<name> (React FC) 
// ArticleCard {article} needs to match the props inside ArticleCardProps. Destructuring is done to avoid writing props.article
export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    // Combine date and time from API to create a proper datetime string
    const timeAgo = getTimeAgo(article.dateTimePub);

    // IMG-SRC: full width of the container, 14rem height(h-56) crop the image(cover) 
    // Divide tailwind size by 4 to get rem
    // news-image fallback CSS class
    // XS: text size
    // mb: margin-bottom p-2 padding on all sides m-8 margin on all
    return (
        <article className="rounded-md shadow hover:shadow-lg transition overflow-hidden m-6 news-card">
            <img src={article.image} alt={article.title} className="w-full h-56 object-cover news-image"/>
            <div className="text-xs text-gray-500 mb-1 p-2 text-left">
            {article.categories?.[0]?.label?.split('/')?.[0] ?? 'Uncategorized'} • 
            {article.source?.name ?? 'Unknown Source'} •
            {timeAgo}
            </div>
            <h2 className="text-left text-lg font-bold p-2 mb-1" >{article.title}</h2>
            <p className="text-left p-2">{article.body ? article.body.substring(0, 150) + '...' : 'No content available'}</p>
        </article>
    )
}

// Add later: click for navigating to the full article.