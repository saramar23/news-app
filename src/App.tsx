import "./App.css"
import { useEffect } from "react";
import { fetchArticles } from "./services/newsApi";
import { HomePage } from "./components/HomePage/HomePage";

function App() {

  useEffect(() => {
    const getArticles = async () => {
      try {
        const articles = await fetchArticles();
        console.log("Fetched articles:", articles.length);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    getArticles();
  }, []);

  return (
    <HomePage />
  );
}

export default App
