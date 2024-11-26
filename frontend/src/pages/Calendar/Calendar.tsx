//Import frameworks
import { useState } from "react";

//Import icons
import { FaChevronRight } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { MdFilterAlt } from "react-icons/md";
import { MdSort } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import { RiFireFill } from "react-icons/ri";
import { IoCalendarOutline } from "react-icons/io5";
import { ChevronsUpDown } from "lucide-react"
import { FaFlagCheckered } from "react-icons/fa";

//Import styles
import "./style.css"
import SideBarDashboard from "../../components/sidebar/sidebar_dashboard.tsx";

//Import components
import { Button } from "../../components/ui/button.tsx"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../components/ui/collapsible.tsx"
import CalendarGrid from "../../components/draggable/CalendarGrid.tsx";

//Import libs
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Calendar = () => {
    const [isOpenTask, setIsOpenTask] = useState(false);
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex items-start w-full h-full">
                <SideBarDashboard />
                <div className="flex flex-col p-1 w-[70%] h-full relative space-y-2">
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
                            <button className="flex items-center py-1 px-4 space-x-2 bg-indigo-500 text-white rounded-md rounded-r-none text-center">
                                <p>Close</p>
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                    <hr className="my-2 border-[1px]" />
                    <div className="flex justify-end space-x-4 mr-4 text-sm items-center">
                        <button className="flex px-6 py-0.5 border-2 rounded-md font-semibold">Week</button>
                        <button className="flex px-6 py-0.5 border-2 rounded-md font-semibold">Month</button>
                        <div className="flex px-6 py-0.5">
                            <p>Today</p>
                        </div>
                    </div>
                    <div className="flex w-full h-full overflow-y-auto custom-scrollbar">
                        {/* Timeline Sidebar (1-hour span) */}
                        <div className="w-[5%] grid grid-rows-[auto_repeat(24,1fr)] gap-[8px] text-center">
                            {/* Empty placeholder for the first row (day header alignment) */}
                            <div className="h-20"></div>
                            {/* Hourly slots */}
                            {Array.from({ length: 24 }, (_, hour) => (
                                <div
                                    key={hour}
                                    className="flex items-center justify-center text-[11px] font-medium h-20"
                                >
                                    {/* Display the hour in 12-hour AM/PM format */}
                                    {hour === 0
                                        ? '12 AM'
                                        : hour < 12
                                            ? `${hour} AM`
                                            : hour === 12
                                                ? '12 PM'
                                                : `${hour - 12} PM`}
                                </div>
                            ))}
                        </div>
                        {/* Calendar Grid */}
                        <CalendarGrid />
                    </div>
                </div>
                <div className="flex flex-col h-full w-[16%] shadow-[rgba(0,0,15,0.1)_0px_15px_10px_10px] px-2 py-1 space-y-2">
                    <div className="flex w-full p-2 rounded-lg bg-gray-100 relative">
                        <IoSearchSharp className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                        <input type="text" className="w-[70%] h-full rounded-lg bg-gray-100 pl-8 text-sm focus:outline-none" placeholder="Search..." />
                        <div className="flex absolute right-2 top-1/2 transform -translate-y-1/2 space-x-2">
                            <button className="p-1 bg-indigo-600 rounded-md">
                                <MdFilterAlt className="text-white" />
                            </button>
                            <button className="p-1 bg-indigo-600 rounded-md">
                                <MdSort className="text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 overflow-y-auto custom-scrollbar">
                        <button className="flex items-center w-full p-2 text-indigo-500 space-x-2 border px-2 rounded-md text-sm">
                            <FiPlusCircle />
                            <p>Add a task</p>
                        </button>
                        <button className="flex items-center w-full p-2 text-red-500 space-x-2 border px-2 rounded-md text-sm">
                            <RiFireFill />
                            <p>Overdue (10)</p>
                        </button>
                        <Collapsible
                            open={isOpenTask}
                            onOpenChange={setIsOpenTask}
                            className="w-full space-y-2"
                        >
                            <div className="flex items-center">
                                <div className="flex items-center justify-between w-full p-2 border rounded-md text-sm">
                                    <div className=" flex  items-center text-zinc-500 space-x-2 ">
                                        <IoCalendarOutline />
                                        <h4 className="text-sm font-semibold">
                                            No due date (4)
                                        </h4>
                                    </div>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-0">
                                            <ChevronsUpDown className="h-4 w-4" />
                                            <span className="sr-only">Toggle</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                            </div>
                            <CollapsibleContent className="space-y-2">
                                <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-gray-100 border-l-[5px] hover:cursor-grab">
                                    Now empty
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                        <div className="flex flex-col w-full rounded-lg border text-sm px-2 py-3 text-zinc-600 space-y-2">
                            <div>Due: <span className="font-semibold">Monday</span></div>
                            <div className="flex relative flex-col rounded-md border px-2 py-3 space-y-1 font-mono text-sm truncate bg-purple-100 border-l-[5px] border-l-purple-600 hover:cursor-grab">
                                <div className="flex text-[11px] truncate">
                                    <p className="font-bold truncate">Game Development</p>
                                    <p>|</p>
                                    <p className="truncate">Assignment</p>
                                </div>
                                <p className="text-lg font-bold truncate">Homework 02</p>
                                <div className="flex flex-col text-[11px] leading-tight">
                                    <p>Start: <span className="ml-1 font-bold">Nov 23</span></p>
                                    <p>Due: <span className="ml-4 font-bold">Nov 26, 23:55pm</span></p>
                                </div>
                                <div className="flex absolute items-center justify-center right-2 bottom-2 text-[11px] text-emerald-400 font-bold">
                                    <FaFlagCheckered />
                                </div>
                            </div>
                            <div className="flex relative flex-col rounded-md border px-2 py-3 space-y-1 font-mono text-sm truncate bg-blue-100 border-l-[5px] border-l-blue-600 hover:cursor-grab">
                                <div className="flex text-[11px] truncate">
                                    <p className="font-bold truncate">Intro2DE</p>
                                    <p>|</p>
                                    <p className="truncate">Group Project</p>
                                </div>
                                <p className="text-lg font-bold truncate">Presentation</p>
                                <div className="flex flex-col text-[11px] leading-tight">
                                    <p>Start: <span className="ml-1 font-bold">Nov 25, 19:00pm</span></p>
                                    <p>Due: <span className="ml-4 font-bold">Nov 25, 19:15pm</span></p>
                                </div>
                                <div className="flex absolute items-center justify-center right-2 bottom-2 text-[11px] text-emerald-400 font-bold">
                                    <FaFlagCheckered />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full rounded-lg border text-sm px-2 py-3 text-zinc-600 space-y-2">
                            <div>Due: <span className="font-semibold">Tuesday</span></div>
                            <div className="flex relative flex-col rounded-md border px-2 py-3 space-y-1 font-mono text-sm truncate bg-green-100 border-l-[5px] border-l-green-600 hover:cursor-grab">
                                <div className="flex text-[11px] truncate">
                                    <p className="font-bold truncate">AWP</p>
                                    <p>|</p>
                                    <p className="truncate">Group Project</p>
                                </div>
                                <p className="text-lg font-bold truncate">Seminar Proposal</p>
                                <div className="flex flex-col text-[11px] leading-tight">
                                    <p>Start: <span className="ml-1 font-bold">Nov 23</span></p>
                                    <p>Due: <span className="ml-4 font-bold">Nov 26, 23:55pm</span></p>
                                </div>
                                <div className="flex absolute items-center justify-center right-2 bottom-2 text-[11px] text-emerald-400 font-bold">
                                    <FaFlagCheckered />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    )
}

export default Calendar