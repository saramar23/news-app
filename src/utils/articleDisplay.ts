import { ALL_TOPICS_CATEGORY_LABEL, type Article } from "../types";
import { getTimeAgo } from "./getTimeAgo";

const IMAGE_PLACEHOLDER = "/media/image-placeholder.png";

export type ArticleDisplayFields = {
    timeAgo: string;
    imgSource: string;
    category: string;
    source: string;
};

export function getArticleDisplayFields(article: Article): ArticleDisplayFields {
    const label = article.categories?.[0]?.label?.trim();
    return {
        timeAgo: getTimeAgo(article.dateTimePub),
        imgSource: article.image || IMAGE_PLACEHOLDER,
        category: label && label.length > 0 ? label : ALL_TOPICS_CATEGORY_LABEL,
        source: article.source?.title ?? "Unknown Source",
    };
}
