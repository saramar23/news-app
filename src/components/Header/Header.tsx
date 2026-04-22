import { SearchBar } from "./SearchBar";
import { SiteNavigation } from "./SiteNavigation";
import { Logo } from "./Logo";

export const Header = () => {

    return (
        <header>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow flex gap-1 justify-around items-center py-4">
                <Logo />
                <SearchBar />
                <SiteNavigation />
            </div>
        </header>
    )
}