import { useParams } from "react-router-dom";
import { useArticleId } from "../../hooks/useArticleId";
import { Header } from "../Header/Header";
import { getTimeAgo } from "../../utils/getTimeAgo";
import { categoryColors } from "../../types";
import { Breadcrumb } from "../Header/Breadcrumb";
import { RelatedArticles } from "./Sidebar/RelatedArticles";

export const ArticleDetail: React.FC = () => {

    // useParams() is a hook from react router that checks the URL path and grabs a segment (in this case :articleUri)
    const { articleUri } = useParams<{ articleUri: string }>();

    // Some articles ids are "8984020832" and some are "2025-11-2348283402" so we only extract the last part
    const extractNumericId = (uri: string): string => {
        const parts = uri.split('-');
        return parts[parts.length - 1]; 
    };

    const finalArticleId = articleUri ? extractNumericId(articleUri) : undefined;

    // call the hook if articleUri exists, otherwise pass those values
    const articleData = finalArticleId ? useArticleId(finalArticleId) : { articleById: undefined, isLoading: false, error: null };
    // Now articleById, isLoading, and error always exist
    const { articleById, isLoading, error } = articleData;

    if (isLoading || error || !articleById) {
        return (
            <>
                <Header />
                <Breadcrumb />
                <div className="flex justify-center w-full p-8 pt-20">
                    {isLoading && <p className="text-xl text-gray-500">Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && !articleById && (
                        <p className="text-xl text-gray-500">Sorry but we couldn't find any article with that id 😞</p>
                    )}
                </div>
            </>
        );
    }

    const imgSource = articleById.image || "/media/image-placeholder.png";
    const timeAgo = getTimeAgo(articleById.dateTimePub);
    const category = articleById.categories?.[0]?.label?.split('/')?.[1] ?? 'Uncategorized';
    const sourceTitle = articleById.source?.title ?? "Unknown Source";

    // 5xl is 1024px
    
    return (
        <>
            <Header />
            <Breadcrumb />
            <div className="w-full max-w-6xl px-4 py-2 space-y-8 mx-auto text-left">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <header className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl leading-tight text-gray-900">
                                {articleById.title}
                            </h1>
                            <div className="flex flex-wrap space-x-4 text-sm text-gray-600">
                                <span className={`text-xs px-3 py-1 font-semibold rounded-full ${categoryColors[category] || "text-gray-700 bg-gray-200"}`}>
                                    {category}
                                </span>
                                <span>•</span>
                                <span className="font-medium text-gray-700">By {sourceTitle}</span>
                                <span>•</span>
                                <span>Published {timeAgo}</span>
                            </div>
                        </header>
                        <div className="w-full">
                            <img 
                                src={imgSource} 
                                alt={articleById.title} 
                                className="w-full max-h-[30rem] object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <section className="prose prose-lg max-w-none text-gray-800">
                            <p className="whitespace-pre-line"> 
                                {articleById.body ?? "Article body currently unavailable."}
                            </p>
                        </section>

                        {/* Link to original, for comparison lol */}
                        <div className="pt-4">
                            <a 
                                href={articleById.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
                            >
                                Read Article on Source →
                            </a>
                        </div>
                    </div>
                    <aside className="space-y-2">
                        <h2 className="text-xl px-6 font-semibold">Related Articles</h2>
                        <RelatedArticles category={category} articleId={finalArticleId!} />
                    </aside>
                </div>
            </div>
        </>
    )
}