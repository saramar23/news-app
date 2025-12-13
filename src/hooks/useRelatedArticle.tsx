import { useState, useEffect } from "react";
import type { Article, FetchArticlesParams } from "../types";
import { fetchArticles } from "../services/newsApi";

export const useRelatedArticles = ( currentCategory: string, articleId: string ) => {
    const [ relatedArticles, setRelatedArticles ] = useState<Article[] | null>(null);
    const [ isLoading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);
    
    // const currentCategory = currentArticle.articleById?.categories?.[0]?.label?.split('/')?.[1];
    const ARTICLE_LIMIT = 5;

    useEffect(() => {
        if (!currentCategory && !articleId) {
            return;
        }

        const fetchRelated = async() => {
            let finalArticles = [];
            try {
                setLoading(true);
                const primaryParams: FetchArticlesParams = { category: currentCategory as FetchArticlesParams['category'], limit: ARTICLE_LIMIT};
                const { articles: primaryResults } = await fetchArticles(primaryParams); 

                finalArticles = primaryResults;

                if (finalArticles.length < ARTICLE_LIMIT) {
                    const fallbackCount = ARTICLE_LIMIT - finalArticles.length;
                    try {
                        const fallbackParams: FetchArticlesParams = {
                            limit: fallbackCount,
                            sortOption: 'Latest'
                        };

                        const { articles: fallbackResults } = await fetchArticles(fallbackParams);
                        finalArticles = finalArticles.concat(fallbackResults);
                    } catch (err) {
                        console.error("Fallback failed.");
                    }
                }

            } catch (err) {
                err instanceof Error ? setError(err.message) : setError("Error fetching the related articles.");
            }
        }; fetchRelated();
    }, [currentCategory, articleId]);
    return { currentCategory, articleId };
}