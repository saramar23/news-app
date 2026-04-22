import {
    ALL_TOPICS_CATEGORY_LABEL,
    CATEGORY_URI_MAP,
    type Article,
    type FetchArticlesParams,
    type GNewsArticleDTO,
    type GNewsResponse,
} from "../types";
import { runGNewsThrottled } from "./gnewsThrottle";

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
        let startDate: Date = new Date();

        if (dateRange === "Today") {
            startDate.setHours(today.getHours() - 24);
        } else if (dateRange === "This Week") {
            startDate.setDate(today.getDate() - 6);
        } else if (dateRange === "This Month") {
            startDate.setDate(today.getDate() - 29);
        }
        queryParams.set("from", startDate.toISOString());
    }

    if (endpoint === "search") {
        const sortMap: Record<string, string> = {
            Latest: "publishedAt",
            "Most Relevant": "relevance",
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

                const articles = rawArticles.map((item: GNewsArticleDTO): Article => ({
                    uri: item.url, 
                    title: item.title,
                    body: item.content || item.description,
                    url: item.url,
                    image: item.image,
                    date: item.publishedAt.split("T")[0],
                    time: item.publishedAt.split("T")[1].replace("Z", ""),
                    dateTime: item.publishedAt,
                    dateTimePub: item.publishedAt,
                    summary: item.description,
                    source: {
                        dataType: "news",
                        title: item.source.name,
                        uri: item.source.url
                    },
                    author: item.source.name,
                    categories: category
                        ? [{ uri: CATEGORY_URI_MAP[category], label: category, wgt: 1 }]
                        : [{ uri: "general", label: ALL_TOPICS_CATEGORY_LABEL, wgt: 1 }],
                    sentiment: 0,
                    entities: { people: [], organizations: [], locations: [] },
                    socialScore: 0,
                    language: "en"
                }));

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
        apiKey: API_KEY
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