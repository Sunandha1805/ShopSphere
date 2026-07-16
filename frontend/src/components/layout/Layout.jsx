import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 bg-white">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Layout;