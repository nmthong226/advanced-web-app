import SideBar from "../components/sidebar/sidebar";
import { Outlet } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
    return (
        <>
            <SignedIn>
                <div className="flex flex-row w-full h-screen">
                    <SideBar />
                    <main className="flex-grow bg-indigo-50">
                        <Outlet />
                        {/* <Toaster /> */}
                        <ToastContainer
                            position="bottom-right"
                            autoClose={4000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="dark"
                            transition={Bounce}
                        />
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