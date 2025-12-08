import { useEffect, useRef, useState } from "react";
import type { Article } from "../types";
import { fetchArticleById } from "../services/newsApi";

const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const useArticleId = (articleUri: Article["uri"]) => {
    const [ articleById, setArticleById ] = useState<Article | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);

    const cache = useRef<Map<string, { article: Article; timestamp: number }>>(new Map());

    useEffect(() => {

        if (!articleUri) {
            return;
        }

        const cachedArticle = cache.current.has(articleUri);

        const fetchingArticle = async() => {
            if (cachedArticle) {
                const cachedEntry = cache.current.get(articleUri);
                if (cachedEntry) {
                    if (Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
                        setArticleById(cachedEntry.article);
                    } else {
                        cache.current.delete(articleUri);
                    }
                }
            } else {
                try {
                    setIsLoading(true);
                    const result = await fetchArticleById(articleUri);
                    console.log("Fetching article by id: " + articleUri);
                    if (result) {
                        setArticleById(result);
                        cache.current.set(articleUri, {article: result, timestamp: Date.now()});
                    }   
                    setIsLoading(false);                 
                } catch (err) {
                    err instanceof Error ? setError(err.message) : setError("Error fetching the article.");
                }
            }
        }; fetchingArticle();
    }, [articleUri]);
    return { articleById, isLoading, error };
}