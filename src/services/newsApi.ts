// ### Task 2: API Service Layer
// **Objective:** Create a centralized service for all NewsAPI.ai interactions

// **Requirements:**
// - Create `services/newsApi.ts` with core API functions
// - Implement `fetchArticles()` with filtering parameters
// - Implement `fetchArticleById()` for single article retrieval
// - Add proper error handling and response validation
// - Include timeout and retry logic

// **Key Considerations:**
// - How will you handle API rate limits gracefully?
// - What should happen when the API is unavailable?
// - How can you make the service testable and mockable?

// **Success Criteria:** Can successfully fetch and log articles from NewsAPI.ai


import type { Article, FetchArticlesParams } from "../types";
const apiKey = import.meta.env.VITE_NEWS_API_KEY;

export const fetchArticles = async(params: FetchArticlesParams = {}): Promise<Article[]> => {
    
    const url = new Request("https://eventregistry.org/api/v1/article/getArticles");
    const { category, dateRange, source, sortOption = "Latest", query, page = 1} = params;

    const queryObject: Record<string, any> = {};

    if (category) {
        queryObject.categoryUri = `dmoz/${category}`;
    }

    if (query) {
        queryObject.keyword = query;
    }

    if (source) {
        queryObject.sourceUri = source.uri;
    }

    if (dateRange === "Today") {
        const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
        queryObject.dateStart = today;
        queryObject.dateEnd = today;
    }

    if (Object.keys(queryObject).length === 0) {
        queryObject.keyword = "news";
    }

    // payload for the API
    const requestBody = {
        query: {
            $query: queryObject,
            $lang: "eng",
            
            $filter: {
                forceMaxDataTimeWindow: "30",
            },
        },
        resultType: "articles",
        articlesSortBy:
            sortOption === "Most Relevant" ? "rel" : sortOption === "Most Shared" ? "socialScore" : "date",
        articlesCount: 2,
        articlesPage: page, // tells event registry which page I want
        includeArticleCategories: true,                
        apiKey: apiKey
    };
        var attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                    signal: AbortSignal.timeout(5000)
                });
                
                if (!response.ok) {
                    console.error(`Attempt ${attempts + 1} failed with status ${response.status}`);
                    attempts++;
                    continue;
                }
                const data = await response.json();   
                if (!data?.articles?.results) {
                    throw new Error("Unexpected response format");
                }
                return data.articles.results;
                
            } catch (error) {
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
                return[];
            }
        }
    }
    return[];
}


// const articles = await fetchArticles({
//     category: "Technology",
//     query: "AI",
//     date: "Today",
//     sort: "Most Relevant",
//     limit: 3,
// });

// uri: '8889302461'

export const fetchArticleById = async (params: Article["uri"]): Promise<Article | null> => {
    
    const url = `https://eventregistry.org/api/v1/article/getArticle/`;
    var attempts = 0;
    const maxAttempts = 3;

    const requestBody = {
        articleUri: params,
        apiKey: apiKey
    };

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) {
                attempts++;
                console.error(`Attempt ${attempts + 1} failed with status ${response.status}`);
                continue;
            }
            const data = await response.json();

            if (!data.article) {
                console.log("Sorry but we couldn't find any article with that id :( .");
                return null;
            }
            console.log("Your article here: ");
            return data.article as Article;
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