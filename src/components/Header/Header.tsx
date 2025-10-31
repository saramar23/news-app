import React from "react";
import { SearchBar } from "./SearchBar";

export const Header = () => {

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow flex gap-2 justify-around items-center py-4">
                <h1>NewsHub</h1>
                <SearchBar />
                <ul className="flex gap-4 justify-center items-center py-4">
                    <li><a>Technology</a></li>
                    <li><a>Gaming</a></li>
                    <li><a>Business</a></li>
                    <li><a>Health</a></li>
                    <li><a>Science</a></li>
                </ul>
        </header>
    )
}