import {
    type GNewsArticleDTO,
    type Article,
    type Category,
    CATEGORY_URI_MAP,
    ALL_TOPICS_CATEGORY_LABEL,
} from "../types";

const isCategory = (value: string): value is Category => value in CATEGORY_URI_MAP;

export const mapGnewsToArticle = (item: GNewsArticleDTO, category?: string): Article => ({
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
    categories:
        category && isCategory(category)
            ? [{ uri: CATEGORY_URI_MAP[category], label: category, wgt: 1 }]
            : [{ uri: "general", label: ALL_TOPICS_CATEGORY_LABEL, wgt: 1 }],
    sentiment: 0,
    entities: { people: [], organizations: [], locations: [] },
    socialScore: 0,
    language: "en"
});