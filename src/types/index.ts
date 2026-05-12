export interface Article {
  uri: string;
  title: string;
  body: string;
  url: string;
  image: string;
  date: string;               // Date portion (YYYY-MM-DD)
  time: string;               // Time portion (HH:mm:ss)
  dateTime: string;           // Full datetime in UTC
  dateTimePub: string; 
  summary: string;
  source: {
    dataType: string;
    title: string;
    uri: string;
  };
  author: string;
  categories: {
    uri: string;
    label: string;
    wgt: number;
  }[];    
  sentiment: number; // -1 to 1
  entities: {
    people: string[];
    organizations: string[];
    locations: string[];
  };
  socialScore: number;
  language: string;
  // Extensible for future API changes
  [key: string]: unknown;
}

export type Variant = "hero" | "related" | "default";

export type ArticleCardTitleLevel = "h2" | "h3" | "h4" | "h5" | "h6";

export type ArticleCardProps = {
  article: Article;
  variant: Variant;
  titleHeading?: ArticleCardTitleLevel;
};

export interface GNewsArticleDTO {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticleDTO[];
}

export interface AppState {
  articles: Article[];
  totalResults: number;
  filters: {
    category: Category | undefined;
    dateRange: DateRange | undefined;
    source: Source | undefined;
    sortOption: SortOptions | undefined;
  };
  searchQuery: string;
  loading: boolean;
  error: string | null;
  todaysPick: Article[];
}

export type ArticleGridProps = {
  articles: AppState["articles"];
  isLoading: boolean;
  error: string | null;
}

export type Category = 
| 'Technology' 
| 'Entertainment' 
| 'Business' 
| 'Health' 
| 'Science' 

export const ALL_TOPICS_CATEGORY_LABEL = "All topics";

export const CATEGORY_URI_MAP: Record<Category, string> = {
  Technology: "technology",
  Entertainment: "entertainment",
  Business: "business",
  Health: "health",
  Science: "science",
};

export const categoryColors: Record<string, string> = {
  [ALL_TOPICS_CATEGORY_LABEL]: "text-gray-700 bg-gray-200",
  Technology: "text-blue-600 bg-blue-100",
  Health: "text-red-600 bg-red-100",
  Games: "text-fuchsia-600 bg-fuchsia-100",
  Business: "text-orange-600 bg-orange-100",
  Science: "text-purple-600 bg-purple-100",
  Sports: "text-sky-600 bg-sky-100",
  Society: "text-amber-600 bg-amber-100",
  Entertainment: "text-yellow-600 bg-yellow-100"
}

export type DateRange = 
| 'Today'
| 'This Week'
| 'This Month';

export interface Source {
  id: string;
  name: string;
  uri: string;
}

export type SortOptions =
    | 'Latest'
    | 'Most Relevant'
    | 'Most Shared';

export type FetchArticlesParams = {
  category?: Category;
  dateRange?: DateRange;
  source?: Source;
  sortOption?: SortOptions;
  query?: string;
  limit?: number;
  page?: number;
}

export type SearchContextType = {
  searchQuery: string;
  updateSearchQuery: (newQuery: string) => void;
}

export type FilterContextType = {
  filters: AppState["filters"];
  setFilters: React.Dispatch<React.SetStateAction<AppState["filters"]>>;
}

export type PaginationProps = {
  page: number,
  setPage: (newPage: number) => void,
  totalPages: number
}

export type RelatedArticlesType = {
  category: Category | null,
  excludeId: Article["uri"],
  limit: number
}