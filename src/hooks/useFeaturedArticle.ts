import { useEffect, useState } from "react";
import type { Article } from "../types";
import { fetchArticles } from "../services/newsApi";

export const useFeaturedArticle = () => {

    const [ featuredArticle, setFeaturedArticle ] = useState<Article[] | null>(null);
    const [ isLoading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);
    
    const FEATURED_LIMIT = 3;
    const fetchTimer = (6 * 60 * 60 * 1000);

    useEffect(() => {
            const fetchFeatured = async() => {
                try {
                    setLoading(true);
                    setError(null);
                    const result = await fetchArticles({ dateRange: "Today", sortOption: "Most Shared", limit: FEATURED_LIMIT * 2});
                    const finalFeaturedArticles: Article[] = result.articles.filter(articles => articles.image).slice(0, FEATURED_LIMIT);
                    setFeaturedArticle(finalFeaturedArticles);
                } catch (err) {
                    err instanceof Error ? setError(err.message) : setError("Error fetching featured articles.");
                } finally {
                    setLoading(false);
                }
            };
            fetchFeatured();
            const timerFeaturedNews = setInterval(fetchFeatured, fetchTimer);
            return () => clearInterval(timerFeaturedNews);
    }, []);
    return { featuredArticle, isLoading, error };
}