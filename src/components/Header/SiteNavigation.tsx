import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const SiteNavigation: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMenu = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // removed gap on ul after {}

    return (
        <nav aria-label="Main Menu" role="navigation">
            <div className="flex z-[1000] flex-row items-center justify-evenly p-4 h-[3em]">
                <button
                    onClick={handleMenu}
                    className="block text-[1.5rem] cursor-pointer text-right z-[1010] p-2 md:hidden"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isOpen}
                    aria-controls="menu"
                >
                    {isOpen ? "✕" : "☰"}
                </button>

                <ul
                    id="menu"
                    role="menu"
                    className={`${
                    isOpen ? "block absolute top-0 left-0 w-full z-[1000] opacity-100 bg-white shadow-md" : "hidden"
                    } list-none md:static md:flex md:flex-row md:items-center md:py-4`}
                >
                    {[
                    { label: "Technology", to: "/technology", aria: "Read technology articles" },
                    { label: "Games", to: "/games", aria: "Read gaming articles" },
                    { label: "Business", to: "/business", aria: "Read business articles" },
                    { label: "Health", to: "/health", aria: "Read health articles" },
                    { label: "Science", to: "/science", aria: "Read science articles" },
                    ].map((item) => (
                    <li
                        key={item.label}
                        className="p-4 my-4 text-center hover:bg-gray-200"
                        role="menuitem"
                        tabIndex={0}
                        aria-label={item.aria}
                    >
                        <Link
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className="no-underline "
                        >
                        {item.label}
                        </Link>
                    </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};