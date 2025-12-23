import { useState, useEffect } from "react";
import type { Article, FetchArticlesParams } from "../types";
import { fetchArticles } from "../services/newsApi";

export const useRelatedArticles = ( currentCategory: string, articleId: string ) => {
    const [ relatedArticles, setRelatedArticles ] = useState<Article[] | null>(null);
    const [ isLoading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);
    
    const ARTICLE_LIMIT = 5;

    useEffect(() => {
        if (!currentCategory) {
            return;
        }

        const fetchRelated = async() => {
            let finalArticles: Article[] = [];
            try {
                setLoading(true);
                // Fetching more articles than needed and filtering our by URI to avoid duplicates in the same category, but only showing 5 unique in UI
                const primaryParams: FetchArticlesParams = { category: currentCategory as FetchArticlesParams['category'], limit: ARTICLE_LIMIT * 2};
                const { articles: primaryResults } = await fetchArticles(primaryParams); 

                finalArticles = primaryResults.filter(article => article.uri !== articleId).slice(0, ARTICLE_LIMIT);
                
                // If we only got 2 articles instead of 5 in same category, we fetch again to get the 3 remaining articles but without category, 
                // choosing the latest ones
                if (finalArticles.length < ARTICLE_LIMIT) {
                    const fallbackCount = ARTICLE_LIMIT - finalArticles.length;
                    try {
                        const fallbackParams: FetchArticlesParams = {
                            limit: fallbackCount,
                            sortOption: 'Latest'
                        };

                        const { articles: fallbackResults } = await fetchArticles(fallbackParams);
                        // Set makes sure all values in the array are unique
                        const avoidDuplicates = new Set(finalArticles.map(art => art.uri));
                        const uniqueArticles = fallbackResults.filter(a => a.uri !== articleId && !avoidDuplicates.has(a.uri));
                        finalArticles = finalArticles.concat(uniqueArticles);
                    } catch (err) {
                        // The error is logged instead of being thrown so we can still show the articles from the first fetch
                        console.error("Fallback failed.");
                    }
                }
                setRelatedArticles(finalArticles);
            } catch (err) {
                err instanceof Error ? setError(err.message) : setError("Error fetching the related articles.");
            } finally {
                setLoading(false);
            }
        }; fetchRelated();
    }, [currentCategory, articleId]);
    return { relatedArticles, isLoading, error };
}