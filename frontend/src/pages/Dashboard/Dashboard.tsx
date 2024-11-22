//Import frameworks
import { useState } from "react";

//Import icons
import { FaChevronRight } from "react-icons/fa";

//Import styles
import "./style.css"
import SideBarDashboard from "../../components/sidebar/sidebar_dashboard.tsx";

const Dashboard = () => {
    return (
        <div className="flex items-start w-full h-full">
            <SideBarDashboard />
            <div className="flex flex-col p-1 w-[64%] relative">
                <div className="flex px-8 py-1 justify-start items-center">
                    <div className="flex space-x-8">
                        <button className=" text-indigo-500 text-lg font-semibold">
                            Calendar
                        </button>
                        <button className=" text-gray-700 text-lg font-semibold">
                            Task List
                        </button>
                    </div>
                    <div className="flex absolute right-0 space-x-4 p-0 m-0 items-center">
                        <button className="py-1 px-4 bg-indigo-500 text-white rounded-md text-center">+ Task</button>
                        <button className="flex items-center py-1 px-4 bg-indigo-500 text-white rounded-md rounded-r-none text-center">
                            <p>Close</p>
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
                <hr className="my-2 border-[1px]" />
            </div>
        </div>
    )
}

export default Dashboard