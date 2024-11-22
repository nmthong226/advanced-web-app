
//Import Icons
import { HiOutlineHome } from "react-icons/hi";
import { IoCalendarOutline } from "react-icons/io5";
import { BsListTask } from "react-icons/bs";
import { TfiTimer } from "react-icons/tfi";
import { SiGoogleanalytics } from "react-icons/si";
import { IoMdSettings } from "react-icons/io";
import { TfiHelpAlt } from "react-icons/tfi";

//Import sample asset
import user_avatar from '/avatar.png';
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate('/dashboard');
  }
  return (
    <aside className="flex flex-col w-14 h-full border-r-[1px] items-center py-2 justify-between ">
      <div className="flex flex-col">
        <div className="flex w-8 h-8 mx-1">
          <img width="48" height="48" src="https://img.icons8.com/parakeet/48/machine-learning.png" alt="machine-learning" />
        </div>
        <div className="flex flex-col my-6 space-y-2">
          <div
            className="relative group p-2 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-md hover:cursor-pointer"
            onClick={navigateToDashboard}
          >
            <HiOutlineHome className="text-white w-6 h-6" />
            <span className="absolute left-[52px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded-md px-2 py-1 transition-opacity duration-200 pointer-events-none z-50">
              Dashboard
            </span>
          </div>
          <div className="relative group p-2 bg-gradient-to-r border-[1px] border-white rounded-md hover:border-gray-300 hover:cursor-pointer">
            <IoCalendarOutline className="text-zinc-800 w-6 h-6" />
            <span className="absolute left-[52px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded-md px-2 py-1 transition-opacity duration-200 pointer-events-none z-50">
              Calendar
            </span>
          </div>
          <div className="relative group p-2 bg-gradient-to-r border-[1px] border-white rounded-md hover:border-gray-300 hover:cursor-pointer">
            <BsListTask className="text-zinc-800 w-6 h-6" />
            <span className="absolute left-[52px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded-md px-2 py-1 transition-opacity duration-200 pointer-events-none z-50">
              Tasks
            </span>
          </div>
          <div className="relative group p-2 bg-gradient-to-r border-[1px] border-white rounded-md hover:border-gray-300 hover:cursor-pointer">
            <TfiTimer className="text-zinc-800 w-6 h-6" />
            <span className="absolute left-[52px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded-md px-2 py-1 transition-opacity duration-200 pointer-events-none z-50">
              Timer
            </span>
          </div>
          <div className="relative group p-2 bg-gradient-to-r border-[1px] border-white rounded-md hover:border-gray-300 hover:cursor-pointer">
            <SiGoogleanalytics className="text-zinc-800 w-6 h-6" />
            <span className="absolute left-[52px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded-md px-2 py-1 transition-opacity duration-200 pointer-events-none z-50">
              Analytics
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2 rounded-3xl bg-gray-200">
        <div className="p-2 rounded-md hover:border-gray-300 hover:cursor-pointer">
          <TfiHelpAlt className="w-6 h-6" />
        </div>
        <div className="p-2 rounded-md hover:border-gray-300 hover:cursor-pointer">
          <IoMdSettings className="w-6 h-6" />
        </div>
        <div className="p-1 hover:border-gray-300 hover:cursor-pointer rounded-full">
          <img className="w-10 h-10 rounded-full" src={user_avatar} />
        </div>
      </div>
    </aside>
  )
}

export default SideBar