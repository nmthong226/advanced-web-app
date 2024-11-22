import SideBar from "../components/sidebar/sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-row w-full h-screen">
            <SideBar />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;