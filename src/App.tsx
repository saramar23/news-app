import "./App.css"
import { HomePage } from "./components/HomePage/HomePage";
import { SearchProvider } from "./contexts/SearchContext";
import { FilterProvider } from "./contexts/FilterContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticleDetail } from "./components/ArticleDetail/ArticleDetail";
import { Layout } from "./components/Layout/Layout";

/** Must match `base` in vite.config so routes work when the app is not served at `/`. */
const routerBasename =
  import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {

  return (
    <BrowserRouter basename={routerBasename}>
      <SearchProvider>
        <FilterProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/*" element={<ArticleDetail />} />
              <Route path="/:category" element={<HomePage />} />
            </Routes>
          </Layout>
        </FilterProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App
