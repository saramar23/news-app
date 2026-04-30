import { useEffect, useRef, useState } from "react";
import type { Article } from "../types";
import { fetchArticleByUrl } from "../services/newsApi";

const CACHE_DURATION = 24 * 60 * 60 * 1000;

function articleMatchesUri(article: Article, uri: string): boolean {
    return uri !== "" && (article.uri === uri || article.url === uri);
}

export const useArticleId = (articleUri: Article["uri"], initialArticle?: Article) => {
    const [articleById, setArticleById] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cache = useRef<Map<string, { article: Article; timestamp: number }>>(new Map());

    useEffect(() => {
        if (!articleUri) {
            setArticleById(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;

        const run = async () => {
            if (initialArticle && articleMatchesUri(initialArticle, articleUri)) {
                if (!cancelled) {
                    setArticleById(initialArticle);
                    setError(null);
                    setIsLoading(false);
                }
                return;
            }

            const cached = cache.current.get(articleUri);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                if (!cancelled) {
                    setArticleById(cached.article);
                    setError(null);
                    setIsLoading(false);
                }
                return;
            }
            if (cached) {
                cache.current.delete(articleUri);
            }

            try {
                if (!cancelled) {
                    setIsLoading(true);
                    setError(null);
                }
                const result = await fetchArticleByUrl(articleUri);
                if (cancelled) return;
                if (result) {
                    setArticleById(result);
                    cache.current.set(articleUri, { article: result, timestamp: Date.now() });
                } else {
                    setArticleById(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Error fetching the article.");
                    setArticleById(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void run();

        return () => {
            cancelled = true;
        };
    }, [articleUri, initialArticle]);

    return { articleById, isLoading, error };
};
