import { useRelatedArticles } from "../../../hooks/useRelatedArticle";
import { ArticleSkeletonCard } from "../../ArticleCard/ArticleSkeletonCard";
import { RelatedArticleCard } from "../../ArticleCard/RelatedArticleCard";

export const RelatedArticles = ({ category, articleId }: { category: string, articleId: string }) => {

    const { relatedArticles, isLoading, error } = useRelatedArticles(category, articleId);

    return (
        <div className="pt-2">
            {isLoading && (
                <div className="grid grid-cols-1 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (<ArticleSkeletonCard key={i} />))}
                </div>)
            }
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && (!relatedArticles || relatedArticles.length === 0) && <p>No articles found.</p>}
            {!isLoading && !error && relatedArticles && relatedArticles.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    {
                        relatedArticles.map((article) =>
                            <RelatedArticleCard key={article.uri} article={article} />)
                    }
                </div>
            )}
        </div>
    )
}