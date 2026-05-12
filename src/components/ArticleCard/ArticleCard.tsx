import React from "react";
import {
    categoryColors,
    type ArticleCardProps,
    type ArticleCardTitleLevel,
    type Variant,
} from "../../types";
import { getArticleDisplayFields } from "../../utils/articleDisplay";
import { highlightSearch, HighlightedText } from "../../utils/searchHighlight";
import { useSearch } from "../../hooks/useSearch";
import { Link } from "react-router-dom";

type VariantStyling = {
    articleClassname: string;
    imageWrapperClassname: string;
    linkClassname: string | "";
    bodyWrapperClassname: string;
}

const VARIANT_STYLES = {
    default: { 
        articleClassname: "block h-[35rem]",
        linkClassname: "",
        imageWrapperClassname: "h-1/2",        
        bodyWrapperClassname: "h-1/2"
    },
    hero: {
        articleClassname: "w-full md:col-span-2",
        linkClassname: "flex flex-col h-full",
        imageWrapperClassname: "h-[300px] md:h-[450px] overflow-hidden",        
        bodyWrapperClassname: "p-4"
    },
    related: { 
        articleClassname: "block h-[20rem] ",
        linkClassname: "",
        imageWrapperClassname: "h-1/2",        
        bodyWrapperClassname: "h-1/2"
    }
} satisfies Record<Variant, VariantStyling>;

const DEFAULT_TITLE_LEVEL: Record<Variant, ArticleCardTitleLevel> = {
    hero: "h2",
    default: "h3",
    related: "h4",
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
    article,
    variant,
    titleHeading,
}) => {
    const { searchQuery } = useSearch();

    const { timeAgo, imgSource, category, source } =
        getArticleDisplayFields(article);

    const style = VARIANT_STYLES[variant];
    const showBody = variant !== "related";

    const titleSegments = article.title
        ? highlightSearch({ text: article.title, query: searchQuery })
        : [{ text: "No match found", highlight: false }];

    // no content available never runs, 400 bad request appears instead
    const bodySegments = showBody ? (article.body
        ? highlightSearch({ text: article.body, query: searchQuery })
        : [{ text: "No content available", highlight: false }]) : null;

    const titleLevel = titleHeading ?? DEFAULT_TITLE_LEVEL[variant];
    const titleClassName = "text-left font-bold p-2 mb-1";

    return (
        <article className={`${style.articleClassname} rounded-md shadow hover:shadow-lg transition overflow-hidden`} >
            <Link 
                to={`/article/${encodeURIComponent(article.uri)}`} 
                state={{ article }}
                className={`${style.linkClassname}`}
            >
                <div className={`${style.imageWrapperClassname}`} >
                    <img src={imgSource} alt={article.title} className="w-full h-full object-cover news-image" />
                </div>
                <div className={`${style.bodyWrapperClassname} p-4 flex flex-col justify-start text-left`}>
                    <div className="text-xs text-gray-500 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[category] || "text-gray-600 bg-gray-200"}`}>
                            {category}
                        </span> •
                        <span className="m-1">{source} </span>•
                        <span className="m-1">{timeAgo}</span>
                    </div>
                    {React.createElement(
                        titleLevel,
                        { className: titleClassName },
                        <HighlightedText segments={titleSegments} />
                    )}
                    {showBody && bodySegments &&
                        (<p className="text-left p-2 overflow-hidden line-clamp-5 break-words">
                            <HighlightedText segments={bodySegments} />
                        </p>)}

                </div>
            </Link>
        </article>
    )
}