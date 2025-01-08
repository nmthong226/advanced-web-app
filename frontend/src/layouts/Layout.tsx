// src/layouts/Layout.tsx
import SideBar from '../components/sidebar/sidebar';
import { Outlet } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  return (
    <div className="flex flex-row w-full h-screen">
      <SideBar />
      <main className="flex-grow custom-scrollbar overflow-auto overflow-y-auto">
        <Outlet />
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
  );
};

export default Layout;
