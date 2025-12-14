import { Link } from "react-router";

export const Breadcrumb = () => {

    const items = [
                    { name: 'Home', path: '/' }, 
                    { name: 'Article', path: '/article' }
                ];

    return (
        <nav aria-label="breadcrumb" className="w-full max-w-6xl pt-24 px-4 mx-auto text-sm text-gray-500 mb-2">
           <ol className="flex space-x-1">
           {items.map((item, index) => (
                <li key={index}>
                    <Link to={item.path} className="hover:underline">
                        {item.name}
                    </Link>
                    {index < items.length - 1 && " / "}
                </li>
            ))}
           </ol> 
        </nav>
    )
}