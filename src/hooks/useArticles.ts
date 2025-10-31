// ### Task 3: Custom Hooks for Data Management
// **Objective:** Create reusable hooks for state and API interactions

// **Requirements:**
// - Create `hooks/useArticles.ts` for article fetching and state
// - Create `hooks/useFilters.ts` for filter state management
// - Create `hooks/useSearch.ts` for search functionality
// - Implement loading states, error handling, and data caching
// - Consider pagination state management

// **Key Considerations:**
// - How will you prevent unnecessary API calls?
// - What's the best way to synchronize filters with API requests?
// - How can you make these hooks composable and reusable?

import { useEffect, useRef, useState } from 'react';
import { fetchArticles } from '../services/newsApi';
import type { Article, FetchArticlesParams } from '../types';

// Pass all the filter options from FetchArticlesParams except query, limit and page. The user will not be able to modify those.... for now
export const useArticles = (filters: Omit<FetchArticlesParams, 'query' | 'limit' | 'page'>, searchQuery: string, page: number, pageSize: number) => {
    const [ articles, setArticles ] = useState<Article[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ totalResults, setTotalResults ] = useState<number>(0); // store the total number of results from the API.

    const cacheRef = useRef<{ [key: string]: {articles: Article[], totalResults: number}}>({});
    // cacheRef.current[key] stores and retrieves previously fetched results
    // Before stringify: {  filters: { category: "Business", dateRange: "Today" },  searchQuery: "AI news" }
    // After: cacheRef.current = {'{"filters":{"category":"Business"},"searchQuery":"AI"}': [/* article list */], ....
    

    useEffect(() => {
        const fetchData = async() => {
            const key = JSON.stringify({filters, searchQuery, page, pageSize});
            if (cacheRef.current[key]) {
                const cached = cacheRef.current[key];
                setArticles(cached.articles);
                setTotalResults(cached.totalResults);
                return;
            }
            setError(null);
            setIsLoading(true);
        try {
            // ...filter: It keeps the code clean and readable, It avoids manually writing each filter field again
            const result: {articles: Article[], totalResults: number} = await fetchArticles({ ...filters, query: searchQuery, page, limit: pageSize});
            cacheRef.current[key] = result; // Storing the result in cache @ [key]
            setArticles(result.articles);
            setTotalResults(result.totalResults);
        } catch (err) {
            err instanceof Error ? setError(err.message) : setError("Unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
        fetchData();
    }, [filters, searchQuery, page, pageSize]); // Re-render any time either of them changes, then run fetchData(). fetchData checks the cache or runs fetchArticles(). 
    // It then updates articles, isLoading, error
    return {articles, isLoading, error, totalResults};
};