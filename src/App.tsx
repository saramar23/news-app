import "./App.css"
import { useEffect } from "react";
import { fetchArticles } from "./services/newsApi";
import { HomePage } from "./components/HomePage/HomePage";
import { SearchProvider } from "./contexts/SearchContext";
import { FilterProvider } from "./contexts/FilterContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticleDetail } from "./components/ArticleDetail/ArticleDetail";

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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:articleUri" element={<ArticleDetail />} />
            
          </Routes>
        </FilterProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App
