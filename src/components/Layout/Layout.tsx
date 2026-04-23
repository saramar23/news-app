import { Header } from "../Header/Header";


export const Layout = ({ children }: {children: React.ReactNode}) => {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <aside>
                
            </aside>
            <footer>
                
            </footer>
        </>
    )
};