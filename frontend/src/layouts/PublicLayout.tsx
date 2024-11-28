import SideBar from "../components/sidebar/sidebar";
import { Outlet } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const Layout = () => {
    return (
        <>
            <SignedIn>
                <div className="flex flex-row w-full h-screen">
                    <SideBar />
                    <main className="flex-grow">
                        <Outlet />
                    </main>
                </div>
            </SignedIn>
            {/* Redirect to sign-in page when signed out */}
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};

export default Layout;