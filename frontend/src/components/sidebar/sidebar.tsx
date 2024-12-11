//Import from frameworks
import { useLocation, useNavigate } from "react-router-dom";

//Import Icons
import { IoHomeOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { BsListTask } from "react-icons/bs";
import { TfiTimer } from "react-icons/tfi";
import { SiGoogleanalytics } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { TfiHelpAlt } from "react-icons/tfi";

//Import components
import { UserButton } from "@clerk/clerk-react";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route path

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Function to determine if the tab is active
  const isActiveTab = (tabPath: string) => {
    return location.pathname === tabPath;
  };

  return (
    <aside className="flex flex-col justify-between items-center p-2 border-r-[1px] w-14 h-full">
      <div className="flex flex-col">
        <div className="flex mx-1 w-8 h-8">
          <img width="48" height="48" src="https://img.icons8.com/parakeet/48/machine-learning.png" alt="machine-learning" />
        </div>
        <div className="flex flex-col space-y-2 my-6">
          <div className={`relative group p-2 bg-gradient-to-r border-[1px] border-white rounded-md hover:border-gray-300 hover:cursor-pointer ${isActiveTab('/home') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/home')}
          >
            <IoHomeOutline className={`${isActiveTab('/home') ? 'text-white' : 'text-zinc-800'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-700 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Dashboard
            </span>
          </div>
          <div className={`relative group p-2 bg-gradient-to-r border-[1px] border-white rounded-md hover:border-gray-300 hover:cursor-pointer ${isActiveTab('/calendar') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/calendar')}>
            <IoCalendarOutline className={`${isActiveTab('/calendar') ? 'text-white' : 'text-zinc-800'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-700 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Calendar
            </span>
          </div>
          <div className={`relative border-[1px] border-white hover:border-gray-300 bg-gradient-to-r p-2 rounded-md hover:cursor-pointer group ${isActiveTab('/task') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/task')}>
            <BsListTask className={`${isActiveTab('/task') ? 'text-white' : 'text-zinc-800'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-700 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Tasks
            </span>
          </div>
          <div className={`relative group p-2 bg-gradient-to-r border-[1px] border-white rounded-md hover:border-gray-300 hover:cursor-pointer ${isActiveTab('/timer') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/timer')}
          >
            <TfiTimer className={`${isActiveTab('/timer') ? 'text-white' : 'text-zinc-800'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-700 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Timer
            </span>
          </div>
          <div className={`relative border-[1px] border-white hover:border-gray-300 bg-gradient-to-r p-2 rounded-md group hover:cursor-pointer ${isActiveTab('/analytics') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
          onClick={() => navigateTo('/analytics')}>
            <SiGoogleanalytics className={`${isActiveTab('/analytics') ? 'text-white' : 'text-zinc-800'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-700 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Analytics
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2 bg-gray-200 rounded-3xl">
        <div className="hover:border-gray-300 p-2 rounded-md hover:cursor-pointer">
          <TfiHelpAlt className="w-6 h-6" />
        </div>
        <div className="hover:border-gray-300 p-2 rounded-md hover:cursor-pointer">
          <IoMdSettings className="w-6 h-6" />
        </div>
        <div className="hover:border-gray-300 p-1 rounded-full hover:cursor-pointer">
          <UserButton />
        </div>
      </div>
    </aside >
  )
}

export default SideBar