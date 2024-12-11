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
import { CalendarDaysIcon, ChevronsUpDown } from "lucide-react"
import { FaFlagCheckered } from "react-icons/fa";
import { BsCollection } from "react-icons/bs";

//Import styles
import "./style.css"

//Import components
import SideBarActivity from "../../components/sidebar/sidebar_activity.tsx";
import { Button } from "../../components/ui/button.tsx"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../components/ui/collapsible.tsx"
import CalendarGrid from "../../components/draggable/CalendarGrid.tsx";

//Import libs/packages
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";

const Calendar = () => {
    const [isOpenTask, setIsOpenTask] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [startDate, setStartDate] = useState("2024-12-08"); // Default date

    const toggleCalendar = () => {
        setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex items-start w-full h-full">
                <SideBarActivity />
                <div className="relative flex flex-col space-y-2 p-1 w-[70%] h-full">
                    <div className="flex justify-start items-center px-8 py-1">
                        <div className="flex space-x-8">
                            <button className="font-semibold text-indigo-500 text-lg">
                                Calendar
                            </button>
                            <button className="font-semibold text-gray-700 text-lg">
                                Task List
                            </button>
                        </div>
                        <div className="right-0 absolute flex items-center space-x-4 m-0 p-0">
                            <button className="bg-indigo-500 px-4 py-1 rounded-md text-center text-white">+ Task</button>
                            <button className="flex items-center space-x-2 bg-indigo-500 px-4 py-1 rounded-md rounded-r-none text-center text-white">
                                <p>Close</p>
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                    <hr className="border-[1px] my-2" />
                    <div className="relative flex justify-end items-center space-x-4 mr-4 text-sm">
                        <button
                            className="flex items-center border-2 px-2 py-1 rounded-md"
                        >
                            <BsCollection className="mr-2 w-4 h-4" /> {/* Correct size classes */}
                            <p>
                                <p>
                                    Preset 1
                                </p>
                            </p>
                        </button>
                        <button
                            className="flex items-center border-2 px-2 py-1 rounded-md"
                            onClick={toggleCalendar}
                        >
                            <CalendarDaysIcon className="mr-2 w-4 h-4" /> {/* Correct size classes */}
                            <p>
                                <p>
                                    {new DayPilot.Date(startDate).toString("dd")} -{" "}
                                    {new DayPilot.Date(startDate).addDays(6).toString("dd MMM yy")}
                                </p>
                            </p>
                        </button>

                        {/* Conditional rendering of the calendar */}
                        {isCalendarVisible && (
                            <div className="top-10 z-50 absolute bg-gray-50 shadow-md p-2 border rounded-md">
                                <DayPilotNavigator
                                    selectMode={"Week"}
                                    showMonths={1}
                                    skipMonths={1}
                                    selectionDay={new DayPilot.Date(startDate)}
                                    onTimeRangeSelected={(args) => {
                                        setStartDate(new DayPilot.Date(args.day).toString("yyyy-MM-dd"));
                                        setIsCalendarVisible(false); // Hide calendar after selecting a date
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <CalendarGrid date={startDate}/>
                </div>
                <div className="flex flex-col space-y-2 shadow-[rgba(0,0,15,0.1)_0px_15px_10px_10px] px-2 py-1 w-[16%] h-full">
                    <div className="relative flex bg-gray-100 p-2 rounded-lg w-full">
                        <IoSearchSharp className="top-1/2 left-2 absolute transform -translate-y-1/2" />
                        <input type="text" className="bg-gray-100 pl-8 rounded-lg w-[70%] h-full text-sm focus:outline-none" placeholder="Search..." />
                        <div className="top-1/2 right-2 absolute flex space-x-2 transform -translate-y-1/2">
                            <button className="bg-indigo-600 p-1 rounded-md">
                                <MdFilterAlt className="text-white" />
                            </button>
                            <button className="bg-indigo-600 p-1 rounded-md">
                                <MdSort className="text-white" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 custom-scrollbar overflow-y-auto">
                        <button className="flex items-center space-x-2 px-2 p-2 border rounded-md w-full text-indigo-500 text-sm">
                            <FiPlusCircle />
                            <p>Add a task</p>
                        </button>
                        <button className="flex items-center space-x-2 px-2 p-2 border rounded-md w-full text-red-500 text-sm">
                            <RiFireFill />
                            <p>Overdue (10)</p>
                        </button>
                        <Collapsible
                            open={isOpenTask}
                            onOpenChange={setIsOpenTask}
                            className="space-y-2 w-full"
                        >
                            <div className="flex items-center">
                                <div className="flex justify-between items-center p-2 border rounded-md w-full text-sm">
                                    <div className="flex items-center space-x-2 text-zinc-500">
                                        <IoCalendarOutline />
                                        <h4 className="font-semibold text-sm">
                                            No due date (4)
                                        </h4>
                                    </div>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-0">
                                            <ChevronsUpDown className="w-4 h-4" />
                                            <span className="sr-only">Toggle</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                            </div>
                            <CollapsibleContent className="space-y-2">
                                <div className="bg-gray-100 px-4 py-3 border border-l-[5px] rounded-md font-mono text-sm truncate hover:cursor-grab">
                                    Now empty
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                        <div className="flex flex-col space-y-2 px-2 py-3 border rounded-lg w-full text-sm text-zinc-600">
                            <div>Due: <span className="font-semibold">Monday</span></div>
                            <div className="relative flex flex-col space-y-1 bg-purple-100 px-2 py-3 border border-l-[5px] border-l-purple-600 rounded-md font-mono text-sm truncate hover:cursor-grab">
                                <div className="flex text-[11px] truncate">
                                    <p className="font-bold truncate">Game Development</p>
                                    <p>|</p>
                                    <p className="truncate">Assignment</p>
                                </div>
                                <p className="font-bold text-lg truncate">Homework 02</p>
                                <div className="flex flex-col text-[11px] leading-tight">
                                    <p>Start: <span className="ml-1 font-bold">Nov 23</span></p>
                                    <p>Due: <span className="ml-4 font-bold">Nov 26, 23:55pm</span></p>
                                </div>
                                <div className="right-2 bottom-2 absolute flex justify-center items-center font-bold text-[11px] text-emerald-400">
                                    <FaFlagCheckered />
                                </div>
                            </div>
                            <div className="relative flex flex-col space-y-1 bg-blue-100 px-2 py-3 border border-l-[5px] border-l-blue-600 rounded-md font-mono text-sm truncate hover:cursor-grab">
                                <div className="flex text-[11px] truncate">
                                    <p className="font-bold truncate">Intro2DE</p>
                                    <p>|</p>
                                    <p className="truncate">Group Project</p>
                                </div>
                                <p className="font-bold text-lg truncate">Presentation</p>
                                <div className="flex flex-col text-[11px] leading-tight">
                                    <p>Start: <span className="ml-1 font-bold">Nov 25, 19:00pm</span></p>
                                    <p>Due: <span className="ml-4 font-bold">Nov 25, 19:15pm</span></p>
                                </div>
                                <div className="right-2 bottom-2 absolute flex justify-center items-center font-bold text-[11px] text-emerald-400">
                                    <FaFlagCheckered />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 px-2 py-3 border rounded-lg w-full text-sm text-zinc-600">
                            <div>Due: <span className="font-semibold">Tuesday</span></div>
                            <div className="relative flex flex-col space-y-1 bg-green-100 px-2 py-3 border border-l-[5px] border-l-green-600 rounded-md font-mono text-sm truncate hover:cursor-grab">
                                <div className="flex text-[11px] truncate">
                                    <p className="font-bold truncate">AWP</p>
                                    <p>|</p>
                                    <p className="truncate">Group Project</p>
                                </div>
                                <p className="font-bold text-lg truncate">Seminar Proposal</p>
                                <div className="flex flex-col text-[11px] leading-tight">
                                    <p>Start: <span className="ml-1 font-bold">Nov 23</span></p>
                                    <p>Due: <span className="ml-4 font-bold">Nov 26, 23:55pm</span></p>
                                </div>
                                <div className="right-2 bottom-2 absolute flex justify-center items-center font-bold text-[11px] text-emerald-400">
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