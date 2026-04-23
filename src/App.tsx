import "./App.css"
import { HomePage } from "./components/HomePage/HomePage";
import { SearchProvider } from "./contexts/SearchContext";
import { FilterProvider } from "./contexts/FilterContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticleDetail } from "./components/ArticleDetail/ArticleDetail";
import { Layout } from "./components/Layout/Layout";

function App() {

  return (
    <BrowserRouter>
      <SearchProvider>
        <FilterProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:articleUri" element={<ArticleDetail />} />
              <Route path="/:category" element={<HomePage />} />
            </Routes>
          </Layout>
        </FilterProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App
