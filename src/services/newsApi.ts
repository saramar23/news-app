import {
    CATEGORY_URI_MAP,
    type Article,
    type FetchArticlesParams,
    type GNewsArticleDTO,
    type GNewsResponse,
} from "../types";
import { runGNewsThrottled } from "./gnewsThrottle";
import { mapGnewsToArticle } from "./mapGnewsToArticle";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY ?? "";

export const fetchArticles = async( params: FetchArticlesParams = {}): Promise<{articles: Article[]; totalResults: number}> => {
    const { category, dateRange, sortOption = "Latest", query, page = 1 } = params;

    const endpoint = query ? "search" : "top-headlines";
    const url = new URL(`https://gnews.io/api/v4/${endpoint}`);

    const queryParams = new URLSearchParams({
        apikey: API_KEY,
        lang: "en",
        max: "6",
        page: page.toString(),
    });

    if (category) {
        queryParams.set("category", CATEGORY_URI_MAP[category]);
    }

    if (query) {
        queryParams.set("q", query);
    }

    if (dateRange) {
        const today = new Date(); // "YYYY-MM-DD"
        const startDate: Date = new Date();

        if (dateRange === "Today") {
            startDate.setHours(today.getHours() - 24);
        } else if (dateRange === "This Week") {
            startDate.setDate(today.getDate() - 6);
        } else if (dateRange === "This Month") {
            startDate.setDate(today.getDate() - 29);
        }
        queryParams.set("from", startDate.toISOString());
    }
    // to fix
    if (endpoint === "search") {
        const sortMap: Record<string, string> = {
            Latest: "publishedAt",
            "Most Relevant": "relevance",////
            "Most Shared": "relevance",
        };
        queryParams.set("sortby", sortMap[sortOption] || "publishedAt");
    }

        let attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
            try {
                const response = await runGNewsThrottled(() =>
                    fetch(`${url.toString()}?${queryParams.toString()}`, {
                        signal: AbortSignal.timeout(5000),
                    })
                );

                if (response.status === 429) {
                    throw new Error(
                        "News API rate limit (429). Wait a few minutes or upgrade your GNews plan."
                    );
                }
                
                if (!response.ok) {
                    console.error(`Attempt ${attempts + 1} failed with status ${response.status}`);
                    attempts++;
                    continue;
                }
                
                const data: GNewsResponse = await response.json();
                
                if (!data) {
                    throw new Error("Unexpected response format (data is not in JSON format).");
                }

                const rawArticles = Array.isArray(data.articles) ? data.articles : [];
                const articles = rawArticles.map((item: GNewsArticleDTO) => mapGnewsToArticle(item, category));

                return {
                    articles, 
                    totalResults: data.totalArticles ?? 0
                }
            } catch (error) {
                if (error instanceof Error && error.message.includes("rate limit")) {
                    throw error;
                }
                attempts++;
                if (error instanceof Error && error.name === "AbortError") {
                    console.error("Fetch stopped early");
                } else if (error instanceof Error && error.name === "TimeoutError") {
                    console.error("Timeout: It took more than 5 seconds to get the result!");
                } else if (error instanceof Error) {
                    console.error(`Error: type: ${error.name}, message: ${error.message}`)
                }
                if (attempts >= maxAttempts) {
                    console.error("Error. Max attempts reached.");
                    return {
                        articles: [], totalResults: 0
                    };
                }
            }
        }
    return {
        articles: [], totalResults: 0
    };
}

export const fetchArticleByUrl = async (url: string): Promise<Article | null> => {

    const search = new URL("https://gnews.io/api/v4/search");
    search.searchParams.set("apikey", API_KEY);
    search.searchParams.set("q", url);
    search.searchParams.set("lang", "en");
    search.searchParams.set("max", "1");
    const apiUrl = search.toString();

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const response = await runGNewsThrottled(() =>
                fetch(apiUrl, {
                    signal: AbortSignal.timeout(5000),
                })
            );

            if (!response.ok) {
                attempts++;
                console.error(`Attempt ${attempts} failed with status ${response.status}`);
                continue;
            }
            const data = await response.json();

            console.log("Article fetched by id successfully :D Gg!");
            return data.articles[0] ? mapGnewsToArticle(data.articles[0]) : null;
        } catch (error) {
            console.error(`Attempt ${attempts + 1} error:`, error);
            attempts++;
            if (attempts >= maxAttempts) {
                console.error("Error. Max attempts reached.");
                return null;
            }
        }
    }
    return null;
}