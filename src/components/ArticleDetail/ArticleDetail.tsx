import { type FC } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getArticleDisplayFields } from "../../utils/articleDisplay";
import { categoryColors, type Article } from "../../types";
import { Breadcrumb } from "../Header/Breadcrumb";
import { RelatedArticles } from "./Sidebar/RelatedArticles";
import { useArticleId } from "../../hooks/useArticleId";

export type ArticleLocationState = { article?: Article };

export const ArticleDetail: FC = () => {
    const { "*": articleUriSplat } = useParams();
    const location = useLocation();
    const state = location.state as ArticleLocationState | null;

    const encodedPath = articleUriSplat ?? "";
    let decodedUri = "";
    try {
        decodedUri = encodedPath ? decodeURIComponent(encodedPath) : "";
    } catch {
        decodedUri = encodedPath;
    }

    const stateArticle = state?.article;
    const initialArticle =
        stateArticle &&
        (stateArticle.uri === decodedUri ||
            stateArticle.url === decodedUri ||
            encodeURIComponent(stateArticle.uri) === encodedPath)
            ? stateArticle
            : undefined;

    const { articleById, isLoading, error } = useArticleId(decodedUri, initialArticle);
    const resolvedArticle = articleById ?? initialArticle ?? null;

    if ((isLoading && !resolvedArticle) || (error && !resolvedArticle) || (!isLoading && !error && !resolvedArticle)) {
        return (
            <>
                <Breadcrumb />
                <div className="flex justify-center w-full p-8 pt-20">
                    {isLoading && !resolvedArticle && <p className="text-xl text-gray-500">Loading...</p>}
                    {error && !resolvedArticle && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && !resolvedArticle && (
                        <p className="text-xl text-gray-500">Sorry but we couldn&#39;t find any article with that id 😞</p>
                    )}
                </div>
            </>
        );
    }

    if (!resolvedArticle) {
        return null;
    }

    const article = resolvedArticle;
    const { timeAgo, imgSource, category, source } = getArticleDisplayFields(article);

    return (
        <>
            <Breadcrumb />
            <div className="w-full max-w-6xl px-4 py-2 space-y-8 mx-auto text-left">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <header className="space-y-4">
                            <h2 className="font-bold text-gray-900">
                                {article.title}
                            </h2>
                            <div className="flex flex-wrap space-x-4 text-sm text-gray-600">
                                <span className={`text-xs px-3 py-1 font-semibold rounded-full ${categoryColors[category] || "text-gray-700 bg-gray-200"}`}>
                                    {category}
                                </span>
                                <span>•</span>
                                <span className="font-medium text-gray-700">By {source}</span>
                                <span>•</span>
                                <span>Published {timeAgo}</span>
                            </div>
                        </header>
                        <div className="w-full">
                            <img
                                src={imgSource}
                                alt={article.title}
                                className="w-full max-h-[30rem] object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <section className="prose prose-lg max-w-none text-gray-800">
                            <p className="whitespace-pre-line">
                                {article.body ?? "Article body currently unavailable."}
                            </p>
                        </section>

                        <div className="pt-4">
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
                            >
                                Read Article on Source →
                            </a>
                        </div>
                    </div>
                    <aside className="space-y-2">
                        <h3 className="font-semibold">Related Articles</h3>
                        <RelatedArticles category={category} articleId={article.uri} />
                    </aside>
                </div>
            </div>
        </>
    );
};
