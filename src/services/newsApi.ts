import {
    CATEGORY_URI_MAP,
    type Article,
    type FetchArticlesParams,
    type GNewsArticleDTO,
    type GNewsResponse,
} from "../types";
import { runGNewsThrottled } from "./gnewsThrottle";
import { mapGnewsToArticle } from "./mapGnewsToArticle";

function normalizeProxyBase(raw: string | undefined): string {
    if (!raw) return "";
    const headlinesPathSuffix = "/top-headlines";
    let baseUrl = raw.trim().replace(/\/+$/, "");
    if (baseUrl.toLowerCase().endsWith(headlinesPathSuffix)) {
        baseUrl = baseUrl
            .slice(0, -headlinesPathSuffix.length)
            .replace(/\/+$/, "");
    }
    return baseUrl;
}

const PROXY_BASE = normalizeProxyBase(import.meta.env.VITE_NEWS_PROXY_URL);

function requireProxyBase(): string {
    if (!PROXY_BASE) {
        throw new Error(
            "VITE_NEWS_PROXY_URL is missing or empty. Configure the news proxy URL."
        );
    }
    return PROXY_BASE;
}

function buildGNewsQueryParams(
    params: FetchArticlesParams
): { queryParams: URLSearchParams; endpoint: "search" | "top-headlines" } {

    const { category, dateRange, sortOption = "Latest", query, page = 1, limit } = params;
    const endpoint = query ? "search" : "top-headlines";

    const max =
        limit != null && limit > 0 ? String(Math.min(limit, 100)) : "6";

    const queryParams = new URLSearchParams({
        lang: "en",
        max,
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

    if (endpoint === "search") {
        const sortMap: Record<string, string> = {
            Latest: "publishedAt",
            "Most Relevant": "relevance",///
            "Most Shared": "relevance",
        };
        queryParams.set("sortby", sortMap[sortOption] || "publishedAt");
    }

    return { queryParams, endpoint };
}

export const fetchArticles = async (
    params: FetchArticlesParams = {}
): Promise<{ articles: Article[]; totalResults: number }> => {
    const { category } = params;
    const proxyBase = requireProxyBase();
    const { queryParams } = buildGNewsQueryParams(params);
    const requestUrl = `${proxyBase}/top-headlines?${queryParams.toString()}`;

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
        try {
            const response = await runGNewsThrottled(() =>
                fetch(requestUrl, {
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
            const articles = rawArticles.map((item: GNewsArticleDTO) =>
                mapGnewsToArticle(item, category)
            );

            return {
                articles,
                totalResults: data.totalArticles ?? 0,
            };
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
                console.error(`Error: type: ${error.name}, message: ${error.message}`);
            }
            if (attempts >= maxAttempts) {
                console.error("Error. Max attempts reached.");
                return {
                    articles: [],
                    totalResults: 0,
                };
            }
        }
    }
    return {
        articles: [],
        totalResults: 0,
    };
};

export const fetchArticleByUrl = async (articleUrl: string): Promise<Article | null> => {
    const proxyBase = requireProxyBase();

    const queryParams = new URLSearchParams({
        q: articleUrl,
        lang: "en",
        max: "1",
        sortby: "publishedAt",
    });

    const apiUrl = `${proxyBase}/top-headlines?${queryParams.toString()}`;

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
};
