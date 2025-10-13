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

export type ArticleCardProps = {
  article: Article;
}

export interface AppState {
    articles: Article[];
    filters: {
      category: Category | null;
      dateRange: DateRange | null;
      source: Source | null;
      sortOption: SortOptions | null;
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
| 'Gaming' 
| 'Business' 
| 'Health' 
| 'Science' 
| 'Entertainment';

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

