import "./App.css"
import { useEffect } from "react";
import { fetchArticles } from "./services/newsApi";
import { HomePage } from "./components/HomePage/HomePage";
import { SearchProvider } from "./contexts/SearchContext";
import { FilterProvider } from "./contexts/FilterContext";

function App() {

  useEffect(() => {
    const getArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles();
        console.log("Fetched articles:", fetchedArticles.articles.length);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    getArticles();
  }, []);

  return (
    <SearchProvider>
      <FilterProvider>
          <HomePage />
      </FilterProvider>
    </SearchProvider>
  );
}

export default App
