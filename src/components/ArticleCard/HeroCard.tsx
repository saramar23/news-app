import { Link } from "react-router-dom";
import { categoryColors, type Article } from "../../types";
import { getTimeAgo } from "../../utils/getTimeAgo";


export const HeroArticleCard = ({ article }: { article: Article }) => {

    const timeAgo = getTimeAgo(article.dateTimePub);
    const imgSource = article.image || "/media/image-placeholder.png";
    const category = article.categories?.[0]?.label?.split('/')?.[1] ?? 'Uncategorized';
    const source = article.source?.title ?? 'Unknown Source';

    return (
        <article className="w-full md:col-span-2 rounded-md shadow hover:shadow-lg transition overflow-hidden" >
            <Link to={`/article/${article.uri}`} className="flex flex-col h-full">
                <div className="h-[300px] md:h-[450px] overflow-hidden" >
                    <img src={imgSource} alt={article.title} className="w-full h-full object-cover news-image"/>
                </div>
                <div className="p-4 flex flex-col justify-start text-left">
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
                    <p className="text-left p-2 overflow-hidden line-clamp-5 break-all" 
                        dangerouslySetInnerHTML={{__html: article.body }}>
                    </p>
                </div>
            </Link>
        </article>
    )
}