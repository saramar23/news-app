export const ArticleSkeletonCard = () => {
    return (
        <div>
            <p>Loading articles...</p>
            <div className="rounded-md shadow transition overflow-hidden m-8 animate-pulse">
                <div className="w-full h-56 object-cover bg-gray-300"></div>
                <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-300 w-1/3 rounded"></div> {/* metadata skeleton */}
                    <div className="h-5 bg-gray-400 w-3/4 rounded"></div> {/* title */}
                    <div className="h-3 bg-gray-300 w-full rounded"></div> {/* body */}
                    <div className="h-3 bg-gray-300 w-5/6 rounded"></div> {/* text */}
                </div>
            </div>
        </div>
    )
}