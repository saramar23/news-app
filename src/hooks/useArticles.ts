import { useEffect, useRef, useState } from 'react';
import { fetchArticles } from '../services/newsApi';
import type { Article, FetchArticlesParams } from '../types';

// Caching to not waste tokens lol
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

// Pass all the filter options from FetchArticlesParams except query, limit and page. The user will not be able to modify those.... for now
export const useArticles = (
        filters: Omit<FetchArticlesParams, 'query' | 'limit' | 'page'>, 
        searchQuery: string, 
        page: number, 
        pageSize: number
    ) => {
    const [ articles, setArticles ] = useState<Article[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ totalResults, setTotalResults ] = useState<number>(0); // store the total number of results from the API.

    // memoryCache.current[key] stores and retrieves previously fetched results
    // Before stringify: {  filters: { category: "Business", dateRange: "Today" },  searchQuery: "AI news" }
    // After: cacheRef.current = {'{"filters":{"category":"Business"},"searchQuery":"AI"}'

    // useRef is a mutable container whose .current property persists across renders. Does NOT trigger a render.
    const memoryCache = useRef<Record<string, { articles: Article[]; totalResults: number } >>({});

    useEffect(() => {
        const key = JSON.stringify({filters, searchQuery, page, pageSize});
        const fetchData = async() => {

            // Change to check RAM first, then storage
        // Local storage
        const stored = localStorage.getItem(`newsCache:${key}`);
            if (stored) {
            const { timestamp, data } = JSON.parse(stored);
            if (Date.now() - timestamp < CACHE_DURATION) {
                // Use cache immediately if < 24h
                memoryCache.current[key] = data;
                setArticles(data.articles);
                setTotalResults(data.totalResults);
                setIsLoading(false);
                console.log("Using localStorage cache");
                return; // do not call API
            } else {
                localStorage.removeItem(`newsCache:${key}`); 
            }
        }

        setError(null);
        setIsLoading(true);

        // Memory cache for testing
        if (memoryCache.current[key]) {
            const cached = memoryCache.current[key];
            setArticles(cached.articles);
            setTotalResults(cached.totalResults);
            setIsLoading(false);
            return;
        }

        //////// Stringify filters on dependency array? /////
            
        try {
            // ...filters: It keeps the code clean and readable, It avoids manually writing each filter field again
            const result: {articles: Article[], totalResults: number} = await fetchArticles({ ...filters, query: searchQuery, page, limit: pageSize});

            console.log("useArticles filters:", filters);
            console.log("useArticles result:", result);

            setArticles(result.articles);
            setTotalResults(result.totalResults);
              
            //memoryCache.current[key] = result; // Storing the result in cache @ [key]

            // Storing result in both localStorage (browser) and memory cache (ram, deleted on dev server restart)
            memoryCache.current[key] = result;
            localStorage.setItem(
                `newsCache:${key}`,
                JSON.stringify({ timestamp: Date.now(), data: result })
            );

            // setArticles(result.articles);
            // setTotalResults(result.totalResults);
        } catch (err) {
            err instanceof Error ? setError(err.message) : setError("Unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
        fetchData();
    }, [filters.category, filters.dateRange, filters.source, filters.sortOption, searchQuery, page, pageSize]); // Re-render any time either of them changes, then run fetchData(). fetchData checks the cache or runs fetchArticles(). 
    // It then updates articles, isLoading, error
    return {articles, isLoading, error, totalResults};
};