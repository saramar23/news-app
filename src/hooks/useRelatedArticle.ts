import { useState, useEffect } from "react";
import { CATEGORY_URI_MAP, type Article, type Category, type FetchArticlesParams } from "../types";
import { fetchArticles } from "../services/newsApi";

export const useRelatedArticles = (currentCategory: string, articleId: string) => {
    const [relatedArticles, setRelatedArticles] = useState<Article[] | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const ARTICLE_LIMIT = 5;

    useEffect(() => {
        if (!currentCategory) {
            return;
        }

        let cancelled = false;

        const fetchRelated = async () => {
            let finalArticles: Article[] = [];
            try {
                setLoading(true);
                setError(null);

                const checkValidCategory = (cat: string): cat is Category => {
                    return cat in CATEGORY_URI_MAP;
                };

                if (checkValidCategory(currentCategory)) {
                    // Fetching more articles than needed and filtering by URI to avoid duplicates in the same category, but only showing 5 unique in UI
                    const primaryParams: FetchArticlesParams = { category: currentCategory, limit: ARTICLE_LIMIT * 2 };
                    const { articles: primaryResults } = await fetchArticles(primaryParams);
                    finalArticles = primaryResults.filter(article => article.uri !== articleId).slice(0, ARTICLE_LIMIT);
                } else {
                    const primaryParams: FetchArticlesParams = { limit: ARTICLE_LIMIT * 2 };
                    const { articles: primaryResults } = await fetchArticles(primaryParams);
                    finalArticles = primaryResults.filter(article => article.uri !== articleId).slice(0, ARTICLE_LIMIT);
                }

                // If we only got fewer than 5 in the same category, fetch again without category for the remainder
                if (finalArticles.length < ARTICLE_LIMIT) {
                    const fallbackCount = ARTICLE_LIMIT - finalArticles.length;
                    try {
                        const fallbackParams: FetchArticlesParams = {
                            limit: fallbackCount,
                            sortOption: "Latest",
                        };

                        const { articles: fallbackResults } = await fetchArticles(fallbackParams);
                        const avoidDuplicates = new Set(finalArticles.map(art => art.uri));
                        const uniqueArticles = fallbackResults.filter(a => a.uri !== articleId && !avoidDuplicates.has(a.uri));
                        finalArticles = finalArticles.concat(uniqueArticles);
                    } catch (err) {
                        if (err instanceof Error) {
                            console.error(err.message);
                        }
                    }
                }
                if (!cancelled) {
                    setRelatedArticles(finalArticles);
                }
            } catch (err) {
                if (!cancelled) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Error fetching the related articles.");
                    }
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchRelated();

        return () => {
            cancelled = true;
        };
    }, [currentCategory, articleId]);
    return { relatedArticles, isLoading, error };
}