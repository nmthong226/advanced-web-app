import ProgressBar from '../../../components/ProgressBar/ProgressBar'
import React, { useEffect, useState } from 'react'

//import libs
import { formatDate, isThisWeek, isToday } from 'date-fns';

//Import icons
import { AiOutlineClockCircle } from 'react-icons/ai';
import { MdOutlineCalendarToday } from 'react-icons/md';
import { GoArrowDown, GoArrowRight, GoArrowUp } from 'react-icons/go';
import { RiRestTimeLine } from 'react-icons/ri';
import { PiEmpty } from "react-icons/pi";
import { FaCheck } from 'react-icons/fa6';
import { BsCalendar4Week, BsCheck, BsListTask } from 'react-icons/bs';

//Import components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select.tsx';

interface Task {
    tasks: any;
}

const MiniTaskTable: React.FC<Task> = ({ tasks }) => {
    const [filter, setFilter] = useState("today"); // Default to "all"

    const filteredTasks = tasks.filter((task: any) => {
        const start = new Date(task.startTime);

        if (filter === "all") return true; // Show all tasks
        if (filter === "today") return isToday(start); // Show tasks due today
        if (filter === "week") return isThisWeek(start); // Show tasks due this week

        return false;
    });

    const [taskStatusCounts, setTaskStatusCounts] = useState({
        completed: 0,
        inProgress: 0,
        pending: 0,
    }); // State for task counts
    useEffect(() => {
        const calculateTaskStatusCounts = () => {
            // Count tasks by their status
            const completedCount = tasks.filter((task: any) => task.status === "completed").length;
            const inProgressCount = tasks.filter((task: any) => task.status === "in-progress").length;
            const pendingCount = tasks.filter((task: any) => task.status === "pending").length;

            // Update state with the counts
            setTaskStatusCounts({
                completed: completedCount,
                inProgress: inProgressCount,
                pending: pendingCount,
            });
        };
        calculateTaskStatusCounts();
    }, [tasks]);
    
    return (
        <div className="flex flex-col justify-between bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg w-full h-[40%]">
            <div className="flex flex-col w-full h-[85%]">
                <div className="flex justify-between items-center border-b">
                    <p className="m-2 font-semibold text-sm">Task Overview</p>
                    <div className='flex items-center space-x-2 m-2'>
                        <Select value="all">
                            <SelectTrigger className="w-[110px] h-8">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="right-[14%]">
                                <SelectItem value="all">
                                    <div className="flex items-center text-[12px]">
                                        <BsListTask className="mr-1 size-3" />
                                        All Tasks
                                    </div>
                                </SelectItem>
                                <SelectItem value="completed">
                                    <div className="flex items-center text-[12px]">
                                        <FaCheck className="mr-1 size-3" />
                                        Completed
                                    </div>
                                </SelectItem>
                                <SelectItem value="pending">
                                    <div className="flex items-center text-[12px]">
                                        <RiRestTimeLine className="mr-1 size-3" />
                                        Pending
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filter} onValueChange={(value) => setFilter(value)}>
                            <SelectTrigger className="flex justify-between items-center px-2 w-[90px] h-8">
                                <AiOutlineClockCircle className="w-4 h-4" />
                                <p className='text-[12px] capitalize'>{filter}</p>
                            </SelectTrigger>
                            <SelectContent className="right-[0%]">
                                <SelectItem value="all">
                                    <div className="flex items-center text-[12px]">
                                        <MdOutlineCalendarToday className="mr-1 size-3" />
                                        All
                                    </div>
                                </SelectItem>
                                <SelectItem value="today">
                                    <div className="flex items-center text-[12px]">
                                        <MdOutlineCalendarToday className="mr-1 size-3" />
                                        Today
                                    </div>
                                </SelectItem>
                                <SelectItem value="week">
                                    <div className="flex items-center text-[12px]">
                                        <BsCalendar4Week className="mr-1 size-3" />
                                        This Week
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col space-y-1 custom-scrollbar p-1 h-full overflow-y-auto">
                    {filteredTasks.length === 0 && (
                        <div className="flex justify-center items-center mt-2">
                            <PiEmpty className="mr-1" />
                            {filter === "all" && <p className="text-[12px]">No tasks found.</p>}
                            {filter === "today" && <p className="text-[12px]">No tasks due today.</p>}
                            {filter === "week" && <p className="text-[12px]">No tasks due this week.</p>}
                        </div>
                    )}
                    {filteredTasks.map((task: any) => (
                        <div
                            key={task._id}
                            className="flex space-x-2 shadow-sm p-1.5 border rounded"
                        >
                            <div className="flex items-center space-x-1 w-[35%] font-semibold text-[12px]">
                                {task.priority === "high" && (
                                    <div>
                                        <GoArrowUp className="w-2.5 h-2.5" />
                                    </div>
                                )}
                                {task.priority === "medium" && (
                                    <div>
                                        <GoArrowRight className="w-2.5 h-2.5" />
                                    </div>
                                )}
                                {task.priority === "low" && (
                                    <div>
                                        <GoArrowDown className="w-2.5 h-2.5" />
                                    </div>
                                )}
                                <span className="mr-2 line-clamp-1">{task.title}</span>
                            </div>
                            <div className="flex items-center w-[25%] h-5 text-[12px] text-gray-500 truncate">
                                {task.status === "pending" && <BsCheck className="mr-1 size-3" />}
                                {task.status === "in-progress" && (
                                    <BsCheck className="mr-1 size-3" />
                                )}
                                {task.status === "completed" && (
                                    <BsCheck className="mr-1 size-3" />
                                )}
                                {task.status === "expired" && (
                                    <BsCheck className="mr-1 size-3" />
                                )}
                                <span className="font-medium">{task.status}</span>
                            </div>
                            <div className="w-[20%] text-[12px] text-gray-500 truncate">
                                <span className=""> {task.category}</span>
                            </div>
                            <div className="w-[20%] text-[12px] text-gray-500 truncate">
                                <span className="">
                                    {task.dueTime
                                        ? formatDate(task.dueTime as string, "dd-MM-yy")
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center p-2 border-t-2 h-[15%]">
                <p className="flex mr-2 text-[12px] text-nowrap">Progress: </p>
                <ProgressBar completed={taskStatusCounts.completed} pending={taskStatusCounts.pending} inProgress={taskStatusCounts.inProgress} />
            </div>
        </div>
    )
}

export default MiniTaskTable