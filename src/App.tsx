import "./App.css"
import { HomePage } from "./components/HomePage/HomePage";
import { SearchProvider } from "./contexts/SearchContext";
import { FilterProvider } from "./contexts/FilterContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticleDetail } from "./components/ArticleDetail/ArticleDetail";

function App() {

  return (
    <BrowserRouter>
      <SearchProvider>
        <FilterProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:articleUri" element={<ArticleDetail />} />
            <Route path="/:category" element={<HomePage />} />
          </Routes>
        </FilterProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App
