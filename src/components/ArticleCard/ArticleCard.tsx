import React from "react";
import type { ArticleCardProps } from "../../types";
import { getTimeAgo } from "../../utils/getTimeAgo";

// React Functional Component<name> (React FC) 
// ArticleCard {article} needs to match the props inside ArticleCardProps. Destructuring is done to avoid writing props.article
export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    // Combine date and time from API to create a proper datetime string
    const timeAgo = getTimeAgo(article.dateTimePub);
    const imgSource = article.image || "public/media/image-placeholder.png";

    // Access first category obj (it seems each article fetched from EventRegistry has multiple categories)
    // ? is optional chaining in case categories is missing or empty
    // The label string will return sth like: "dmoz/Society/Issues/Warfare_and_Conflict"
    // Splitting at / and getting index 1 which is the top-lvl cat
    // No cat or label brings to Uncategorized
    const category = article.categories?.[0]?.label?.split('/')?.[1] ?? 'Uncategorized';
    // ?? Is called the -nullish coalescing operator- it falls back to "Unknown source" if the title is null or undefined. Not triggered by ""
    const source = article.source?.title ?? 'Unknown Source';
    // IMG: full width of the container, 14rem height(h-56) crop the image(cover) 
    // Divide tailwind size by 4 to get rem
    // news-image fallback CSS class
    // XS: text size
    // mb: margin-bottom p-2 padding on all sides m-8 margin on all

    // target _blank opens on a new tab
    // noopener protects my app from malicious script that could be injected by the new page
    // noreferrer prevents the browser from sending the referrer's url (my app) to the destination site

    const categoryColors: Record<string, string> = {
        Technology: "text-blue-600 bg-blue-100",
        Health: "text-red-600 bg-red-100",
        Gaming: "text-fuchsia-600, bg-fuchsia-100",
        Business: "text-orange-600 bg-orange-100",
        Science: "text-purple-600, bg-purple-100",
        Sports: "text-sky-600 bg-sky-100",
        Society: "text-amber-600 bg-amber-100",
        Entertainment: "text-yellow-600 bg-yellow-100",
        Environment: "text-green-600 bg-green-200"
    }

    return (
        <article className="block h-[35rem] rounded-md shadow hover:shadow-lg transition overflow-hidden m-6" >
            <a href={article.url} target="_blank" rel="noopener noreferrer" >
                <div className="h-1/2" >
                    <img src={imgSource} alt={article.title} className="w-full h-full object-cover"/>
                </div>
                <div className="h-1/2 p-4 flex flex-col justify-start text-left">
                    <div className="text-xs text-gray-500 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[category] || "text-gray-600 bg-gray-200"}`}>
                        {category}
                    </span> •
                    <span className="m-1">{source} </span>•
                    <span className="m-1">{timeAgo}</span>
                    </div>
                    <h2 className="text-left text-lg font-bold p-2 mb-1" >{article.title}</h2>
                    <p className="text-left p-2">{article.body ? article.body.substring(0, 120) + '...' : 'No content available'}</p>
                </div>
            </a>
        </article>
    )
}