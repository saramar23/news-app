import { useFeaturedArticle } from "../../../hooks/useFeaturedArticle";
import { RelatedArticleCard } from "../../ArticleCard/RelatedArticleCard";
import { HeroArticleCard } from "../../ArticleCard/HeroArticleCard";

export const TodaysPickPreview = () => {

    const { featuredArticle, isLoading, error } = useFeaturedArticle();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading && (
                <div className="col-span-2">
                    <p>Loading...</p>
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && (!featuredArticle || featuredArticle.length === 0) && <div className="col-span-2">
                    <p>No articles found</p>
                </div>}
            {!isLoading && !error && featuredArticle && featuredArticle.length > 0 && (
                <>
                    <HeroArticleCard article={featuredArticle[0]} />
                    <RelatedArticleCard article={featuredArticle[1]} />
                    <RelatedArticleCard article={featuredArticle[2]} />
                </>
            )}
        </div>
    )
}