//Import from frameworks
import { useLocation, useNavigate } from "react-router-dom";

//Import Icons
import { IoHomeOutline } from "react-icons/io5";
// import { IoCalendarOutline } from "react-icons/io5";
import { BsListTask } from "react-icons/bs";
import { TfiTimer } from "react-icons/tfi";
import { TfiHelpAlt } from "react-icons/tfi";
import { BsCalendarCheck } from "react-icons/bs";
import { FaRegChartBar } from "react-icons/fa";

//Import components
import { UserButton } from "@clerk/clerk-react";
import Settings from "../settings/Settings";

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
    <aside className="flex flex-col justify-between items-center bg-white dark:bg-slate-700 p-2 border-r-[1px] w-14 h-full">
      <div className="flex flex-col">
        <div className="flex justify-center items-center bg-white dark:bg-slate-200 mx-1 rounded-sm w-[41px] h-[41px]">
          <img width="48" height="48" src="https://img.icons8.com/parakeet/48/machine-learning.png" alt="machine-learning" className="size-8" />
        </div>
        <div className="flex flex-col items-center space-y-2 my-6 w-full">
          <div className={`relative group p-2 bg-gradient-to-r border-[1px] border-white dark:border-slate-400 rounded-md hover:border-gray-300 hover:cursor-pointer ${isActiveTab('/home') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/home')}
          >
            <IoHomeOutline className={`${isActiveTab('/home') ? 'text-white' : 'text-zinc-800 dark:text-gray-400'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-900 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Dashboard
            </span>
          </div>
          <div className={`relative group p-2 bg-gradient-to-r border-[1px] border-white dark:border-slate-400 rounded-md hover:border-gray-300 hover:cursor-pointer ${isActiveTab('/calendar') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/calendar')}>
            <BsCalendarCheck className={`${isActiveTab('/calendar') ? 'text-white' : 'text-zinc-800 dark:text-gray-400'} w-5 h-5`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-900 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md w-[90px] text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Task Calendar
            </span>
          </div>
          <div className={`relative border-[1px] border-white dark:border-slate-400 hover:border-gray-300 bg-gradient-to-r p-2 rounded-md hover:cursor-pointer group ${isActiveTab('/task') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/task')}>
            <BsListTask className={`${isActiveTab('/task') ? 'text-white' : 'text-zinc-800 dark:text-gray-400'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-900 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Tasks
            </span>
          </div>
          {/* <div className={`relative group p-2 bg-gradient-to-r border-[1px] border-white dark:border-slate-400 rounded-md hover:border-gray-300 hover:cursor-pointer ${isActiveTab('/timetable') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/timetable')}>
            <IoCalendarOutline className={`${isActiveTab('/timetable') ? 'text-white' : 'text-zinc-800 dark:text-gray-400'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-900 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Timetable
            </span>
          </div> */}
          <div className={`relative group p-2 bg-gradient-to-r border-[1px] border-white dark:border-slate-400 rounded-md hover:border-gray-300 hover:cursor-pointer ${isActiveTab('/timer') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/timer')}
          >
            <TfiTimer className={`${isActiveTab('/timer') ? 'text-white' : 'text-zinc-800 dark:text-gray-400'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-900 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Timer
            </span>
          </div>
          <div className={`relative border-[1px] border-white dark:border-slate-400 hover:border-gray-300 bg-gradient-to-r p-2 rounded-md group hover:cursor-pointer ${isActiveTab('/analytics') ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' : ''}`}
            onClick={() => navigateTo('/analytics')}>
            <FaRegChartBar className={`${isActiveTab('/analytics') ? 'text-white' : 'text-zinc-800 dark:text-gray-400'} w-6 h-6`} />
            <span className="top-1/2 left-[52px] z-50 absolute bg-gray-900 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs transform transition-opacity -translate-y-1/2 duration-200 pointer-events-none">
              Analytics
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex flex-col items-center space-y-2 bg-gray-200 dark:bg-slate-600 rounded-3xl">
          <div className="hover:border-gray-300 p-2 rounded-md hover:cursor-pointer">
            <TfiHelpAlt className="w-5 h-5" />
          </div>
          <div className="hover:border-gray-300 p-2 rounded-md hover:cursor-pointer">
            <Settings />
          </div>
          <div className="hover:border-gray-300 p-1 rounded-full hover:cursor-pointer">
            <UserButton />
          </div>
        </div>
      </div>
    </aside >
  )
}

export default SideBar