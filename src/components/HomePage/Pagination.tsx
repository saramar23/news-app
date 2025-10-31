import type { PaginationProps } from "../../types";

// page is the current page
export const Pagination: React.FC<PaginationProps> = ({ page, setPage, totalPages }) => {
    const MAX_VISIBLE = 3;
    let startPage = Math.max(1, page - Math.floor(MAX_VISIBLE / 2));
    let endPage = startPage + MAX_VISIBLE - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - MAX_VISIBLE + 1);
    }
      
    // Array.from creates an Array of page nums from 1 to totPag, length creates an empty array with -totalPages- slots (gives a length to the array pretty much)
    // _ is the current element
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    const visiblePages = [];

    if (startPage > 1) visiblePages.push(1);
    if (startPage > 2) visiblePages.push("...");
    visiblePages.push(...pageNumbers);
    if (endPage < totalPages - 1) visiblePages.push("...");
    if (endPage < totalPages) visiblePages.push(totalPages);

    return (
        <div className="pagination flex gap-2 justify-center items-center py-4">
            <button 
            type="button" 
            name="prevButton" 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1} 
            aria-label="Go to previous page"
            className="border-solid rounded-lg shadow px-3 py-1"
            > {'<'} </button>
            {visiblePages.map((num, i) => (typeof num === "number" ? (
                <button key={num}
                    onClick={() =>
                        setPage(num)}
                    className={`border-solid rounded-lg shadow px-3 py-1 ${page === num ? "active" : ""}`}
                    {...(page === num ? { "aria-current": "page" } : {})}
                > {num} </button>)
                : (
                    <span key={`ellipsis-${i}`}>...</span>
                )
            ))}
            {page < totalPages && 
                <button 
                type="button" 
                name="nextButton" 
                onClick={() => setPage(page + 1)} 
                disabled={page === totalPages} 
                aria-label="Go to next page"
                className="border-solid rounded-lg shadow px-3 py-1"
                > {'>'} </button>
            }
        </div>
    )
}