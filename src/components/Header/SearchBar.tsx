import { useState, useEffect } from "react";
import { useSearch } from "../../hooks/useSearch";
import { Search, X } from "lucide-react";

export const SearchBar = () => {
    const { updateSearchQuery } = useSearch();
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            updateSearchQuery(inputValue.trim());
        }, 500);

        return () => {
            clearTimeout(debounceSearch);
        };
    }, [inputValue, updateSearchQuery]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateSearchQuery(inputValue);
    }

    const clearSearch = () => {
        setInputValue("");
        updateSearchQuery("");
    }

    return (
        <>
            <div
                aria-label="Main Navigation"
                className="my-2 flex min-w-0 max-w-lg flex-1 border-solid rounded-md shadow-md focus:outline"
            >
                <form
                    role="search"
                    onSubmit={handleSearch}
                    className="flex min-w-0 w-full items-center justify-between gap-1 px-1"
                >
                    <input
                        type="text"
                        name="search"
                        placeholder="Search keywords..."
                        value={inputValue}
                        onChange={handleChange}
                        className="min-w-0 flex-1 border-0 bg-transparent py-2 pl-1 pr-1 placeholder-gray-300 outline-none focus:ring-0"
                    />
                    <div className="flex shrink-0 items-center gap-0 pr-0.5">
                        <button
                            aria-label="Search articles"
                            type="submit"
                            className="inline-flex p-1.5"
                        >
                            <Search />
                        </button>
                        <button
                            aria-label="Clear Search"
                            type="button"
                            onClick={clearSearch}
                            className="inline-flex p-1.5"
                        >
                            <X />
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}