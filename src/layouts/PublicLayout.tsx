import { Outlet } from "react-router-dom";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

const Layout = () => {
    return (
        <div className="flex flex-col w-full h-screen">
            {/* <Header /> */}
            <main className="flex-grow">
                <Outlet />
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default Layout;