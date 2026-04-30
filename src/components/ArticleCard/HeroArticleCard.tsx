import { Link } from "react-router-dom";
import { categoryColors, type Article } from "../../types";
import { getArticleDisplayFields } from "../../utils/articleDisplay";
import { highlightSearch, HighlightedText } from "../../utils/searchHighlight";
import { useSearch } from "../../hooks/useSearch";

export const HeroArticleCard = ({ article }: { article: Article }) => {
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
        <article className="w-full md:col-span-2 rounded-md shadow hover:shadow-lg transition overflow-hidden" >
            <Link
                to={`/article/${encodeURIComponent(article.uri)}`}
                state={{ article }}
                className="flex flex-col h-full"
            >
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
                    <h2 className="text-left font-bold mb-1">
                        <HighlightedText segments={titleSegments} />
                    </h2>
                    <p className="text-left p-2 overflow-hidden line-clamp-5 break-word">
                        <HighlightedText segments={bodySegments} />
                    </p>
                </div>
            </Link>
        </article>
    )
}