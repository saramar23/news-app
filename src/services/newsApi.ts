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


import { CATEGORY_URI_MAP, type Article, type FetchArticlesParams } from "../types";

const apiKey = import.meta.env.VITE_NEWS_API_KEY;

export const fetchArticles = async(params: FetchArticlesParams = {}): Promise<{articles: Article[]; totalResults: number}> => {
    
    const url = new Request("https://eventregistry.org/api/v1/article/getArticles");
    const { category, dateRange, source, sortOption = "Latest", query, page = 1} = params;

    const queryObject: Record<string, any> = {};

    if (category) {
        const mapped = CATEGORY_URI_MAP[category];
        if (mapped) {
            queryObject.categoryUri = `dmoz/${mapped}`;
            queryObject.lang = "eng";          //
        }
    }    

    if (query) {
        queryObject.keyword = query;
    }

    if (source) {
        queryObject.sourceUri = source.uri;
    }

    if (dateRange) {
        const today = new Date(); // "YYYY-MM-DD"
        if (dateRange === "Today") {
            const todayStr = today.toISOString().split("T")[0];
            queryObject.dateStart = todayStr;
            queryObject.dateEnd = todayStr;
        } else if (dateRange === "This Week") {
            const thisWeekStart = new Date(today);
            const thisWeekEnd = new Date(today); // for testing 
            thisWeekStart.setDate(today.getDate() - 7);
            thisWeekEnd.setDate(today.getDate() - 4); ///////// test
            queryObject.dateStart = thisWeekStart.toISOString().split("T")[0];
            queryObject.dateEnd = thisWeekEnd.toISOString().split("T")[0]; // added for testing
            // queryObject.dateEnd = today.toISOString().split("T")[0]; removed for testing
        } else if (dateRange === "This Month") {
            const thisMonthStart = new Date(today);
            const thisMonthEnd = new Date(today); //////
            thisMonthStart.setDate(today.getDate() - 30);
            thisMonthEnd.setDate(today.getDate() - 14); ///////////
            queryObject.dateStart = thisMonthStart.toISOString().split("T")[0];
            queryObject.dateEnd = thisMonthEnd.toISOString().split("T")[0];
            // queryObject.dateEnd = today.toISOString().split("T")[0];  // removed for testing
        }
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
        articlesCount: 6,
        articlesPage: page, // tells event registry which page I want
        includeArticleCategories: true,      
        includeArticleImage: true,    
        apiKey: apiKey
    };

        var attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
            try {
                console.log("Fetching category:", category, "→", queryObject.categoryUri); /////////////
                // if not working go back to post and url instead of finalUrl, uncomment header and body
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
                console.log("Fetched", data.articles.results.length, "articles for", category); /////////
                
                if (!data?.articles?.results) {
                    throw new Error("Unexpected response format (data is not in JSON format).");
                }
                return {
                    articles: data.articles.results, 
                    totalResults: data.articles.totalResults ?? 0
                }
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
                return{
                    articles: [], totalResults: 0
                };
            }
        }
    }
    return{
        articles: [], totalResults: 0
    };
}

export const fetchArticleById = async (params: Article["uri"]): Promise<Article | null> => {

    const normalizedUri = params.includes("-") ? params.split("-").pop()! : params;
    
    const url = `https://eventregistry.org/api/v1/article/getArticle`;
    var attempts = 0;
    const maxAttempts = 3;

    const requestBody = {
        articleUri: normalizedUri,
        infoArticleBodyLen: -1,
        resultType: "info",
        includeArticleBody: true,
        includeArticleCategories: true,     
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

            const article = data[normalizedUri];

            if (!article) {
                console.log("Article not found for URI:", normalizedUri);
                console.error("API Response Data:", data);
                return null;
            }

            const returnedArticle = article.info || article;

            console.log("Returned Article Object:", article);
            console.log("Article fetched by id successfully :D Gg!");
            return returnedArticle as Article;
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