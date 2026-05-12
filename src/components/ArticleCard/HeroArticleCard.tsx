import { type Article } from "../../types";
import { ArticleCard } from "./ArticleCard";

export const HeroArticleCard = ({ article }: { article: Article }) => {
    

    return (
        <ArticleCard variant="hero" article={article} />
    )
}