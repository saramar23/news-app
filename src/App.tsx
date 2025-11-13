import "./App.css"
import { useEffect } from "react";
import { fetchArticles } from "./services/newsApi";
import { HomePage } from "./components/HomePage/HomePage";
import { SearchProvider } from "./contexts/SearchContext";
import { FilterProvider } from "./contexts/FilterContext";
import { BrowserRouter } from "react-router-dom";

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
    <BrowserRouter>
      <SearchProvider>
        <FilterProvider>
            <HomePage />
        </FilterProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App
