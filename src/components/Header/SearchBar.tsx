import { useState, useEffect } from "react";
import { useSearch } from "../../hooks/useSearch";

export const SearchBar = () => {
    const { updateSearchQuery } = useSearch();
    const [ inputValue, setInputValue ] = useState("");

    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            if (!inputValue.trim()) return; 
            updateSearchQuery(inputValue);
        }, 500);

        return () => {
            clearTimeout(debounceSearch);
        };
    }, [inputValue]);

    // inputValue (local state) is updated on every keystroke, but doesn't trigger any fetch
    /* handleChange is used to keep track of the users Input, then this input (its value) is updated and passed to handleSearch form function, 
    * that will actually trigger the response by giving me the articles that match the input value.
    */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    /* searchQuery triggers the fetch cause it's used by useArticles. It's not local but shared across components (HomePage, Grid, ..)
    *   it only updates when calling updateSearchQuery, so handleSearch is like a bridge that commits the query
    */
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateSearchQuery(inputValue);
   }

   const clearSearch = () => {
        setInputValue("");
   }

   return (
    <>
        <nav aria-label="Main Navigation" className="flex border-solid rounded-md shadow focus:outline rounded-md w-md">
            <form role="search" 
                  onSubmit={handleSearch}
                  className="flex justify-between items-center gap-2 w-full">
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Search articles..." 
                    value={inputValue} 
                    onChange={handleChange}
                    className="flex-grow placeholder-gray-300 p-2"
                />
                <button 
                    aria-label="Search articles" 
                    type="submit"
                    className="m-2">
                        Search
                    </button>
                <button 
                    aria-label="Clear Search" 
                    type="button" 
                    onClick={clearSearch}
                    className="m-2">
                    X
                </button>
            </form>
        </nav>
    </>
   )
}