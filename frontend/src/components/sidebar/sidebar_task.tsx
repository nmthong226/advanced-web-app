import React, { useEffect, useState } from 'react';

// Import components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../components/ui/collapsible";

// Import icons
import { IoSearchSharp } from 'react-icons/io5';
import { MdFilterAlt } from 'react-icons/md';
import { MdSort } from 'react-icons/md';
import { GiEmptyChessboard } from "react-icons/gi";
import { MdTaskAlt } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { GoTag } from "react-icons/go";
import { MdOutlineDragIndicator } from "react-icons/md";

// Import context
import { useTasksContext } from '../table/context/task-context.tsx';
import { Button } from '../ui/button.tsx';
import { ChevronsUpDown } from 'lucide-react';
import { FaRegCircle, FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { BiSolidCircleQuarter } from 'react-icons/bi';
import { cn } from '@/lib/utils.ts';

// Define types for props
type DraggableTaskType = {
    _id: string;
    userId: string;
    title: string;
    category: string;
    status: string; // Added status to type
};

type SideBarTaskProps = {
    draggableTasks: DraggableTaskType[];
    handleDragStart: (task: { _id: string; userId: string; title: string; name: string, status: string, category: string }) => void;
};

// Define category-based colors
const categoryColors: { [key: string]: string } = {
    work: "bg-[#CDC1FF]/40 border-gray-300 border-[1px]", // Blue
    leisure: "bg-[#96E9C6]/40 border-gray-300 border-[1px]", // Green
    personal: "bg-[#FDE767]/40 border-gray-300 border-[1px]", // Yellow
    urgent: "bg-[#FC4100]/40 border-gray-300 border-[1px]", // Red
    default: "bg-[#EEF2FF]/40 border-gray-300 border-[1px]", // Default color
};

const SideBarTask: React.FC<SideBarTaskProps> = ({ draggableTasks, handleDragStart }) => {
    const [loading, setLoading] = useState(true);
    const { handleOpen } = useTasksContext();

    // Simulate data fetching
    useEffect(() => {
        const fetchTasks = () => {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        };

        fetchTasks();
    }, []);

    // Group tasks by category
    const categorizedTasks = draggableTasks.reduce((acc, task) => {
        if (!acc[task.category]) {
            acc[task.category] = [];
        }
        acc[task.category].push(task);
        return acc;
    }, {} as Record<string, DraggableTaskType[]>);

    const handleColor = (category: string): string => {
        // Return the color based on the category or the default color if not found
        return categoryColors[category.toLowerCase()] || categoryColors.default;
    };

    return (
        <div className="flex flex-col space-y-2 bg-white dark:bg-slate-700 p-2 border rounded-lg w-[16%] h-full">
            <div className="flex justify-between items-center space-x-2 bg-gradient-to-t from-indigo-500 to-blue-400 py-1.5 pl-2 border rounded-md w-full text-white">
                <button
                    className="flex justify-center items-center space-x-2 w-full text-center"
                    onClick={() => handleOpen('create')}
                >
                    <p className="text-center">Add Task</p>
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <div className="flex justify-center items-center border-l w-8">
                            <IoIosArrowDown className="size-5" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mt-2 mr-[182px] w-[214px]">
                        <DropdownMenuItem className="flex items-center">
                            <MdTaskAlt />
                            Add Task
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                            <GoTag /> Add Tag
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <hr className="border-[1px] my-2" />
            <div className="relative flex bg-gray-100 dark:bg-slate-600 p-2 rounded-lg w-full">
                <IoSearchSharp className="top-1/2 left-2 absolute transform -translate-y-1/2" />
                <input
                    type="text"
                    className="bg-gray-100 dark:bg-slate-600 pl-8 rounded-lg w-[70%] h-full text-sm focus:outline-none"
                    placeholder="Search..."
                />
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
                <div className="flex flex-col space-y-3 w-full max-h-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="loader"></div>
                            <p className="ml-2 text-sm text-zinc-500">Loading tasks...</p>
                        </div>
                    ) : (
                        <>
                            {draggableTasks.length === 0 && (
                                <div className="flex flex-col items-center space-x-2 space-y-2 px-2 p-2 w-full text-sm text-zinc-500">
                                    <GiEmptyChessboard className="size-10" />
                                    <p className="text-xs">No tasks available for you yet.</p>
                                </div>
                            )}
                            <div>
                                {Object.keys(categorizedTasks).map((category) => (
                                    <Collapsible key={category} className='w-full' open>
                                        <div className="flex justify-between items-center space-x-4">
                                            <h4 className="flex font-semibold text-sm">
                                                {category === 'leisure' && <p className='mr-1'>🧩 </p>}
                                                {category === 'work' && <p className='mr-1'>💼</p>}
                                                {category === 'personal' && <p className='mr-1'>🪅</p>}
                                                {category === 'urgent' && <p className='mr-1'>💥</p>}
                                                {category}
                                            </h4>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="sm" className="p-0 w-9">
                                                    <ChevronsUpDown className="w-4 h-4" />
                                                    <span className="sr-only">Toggle</span>
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>
                                        <CollapsibleContent>
                                            <div>
                                                {categorizedTasks[category].map((task) => (
                                                    <div
                                                        className={cn(`flex items-center my-1 px-0.5 py-2 rounded-sm w-full text-sm cursor-grab`, handleColor(task.category))}
                                                        draggable="true"
                                                        key={task._id}
                                                        onDragStart={() =>
                                                            handleDragStart({ _id: task._id, userId: task.userId, title: `${task.title}`, name: task.title, status: task.status, category: task.category })
                                                        }
                                                    >
                                                        <MdOutlineDragIndicator className='size-4' />
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className='mx-1 outline-none'>
                                                                <div className='flex items-center space-x-1 w-full h-full'>
                                                                    <div className='hover:bg-slate-200 px-0.5 hover:cursor-pointer'>
                                                                        {task.status === 'pending' && (
                                                                            <FaRegCircle className='text-purple-700' />
                                                                        )}
                                                                        {task.status === 'in-progress' && (
                                                                            <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                                                                                <div className="flex justify-center items-center rounded-full w-4 h-4">
                                                                                    <BiSolidCircleQuarter className="text-blue-700" />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {task.status === 'completed' && (
                                                                            <FaRegCircleCheck className='text-emerald-700' />
                                                                        )}
                                                                        {task.status === 'expired' && (
                                                                            <FaRegCircleXmark className='text-red-700' />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className='space-y-1'>
                                                                <DropdownMenuItem className='flex items-center space-x-2 bg-purple-100 w-full h-full'>
                                                                    <FaRegCircle className='text-purple-700' />
                                                                    <p className='text-xs'>Pending</p>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className='flex items-center space-x-2 bg-blue-100 w-full h-full'>
                                                                    <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                                                                        <div className="flex justify-center items-center rounded-full w-4 h-4">
                                                                            <BiSolidCircleQuarter className="text-blue-700" />
                                                                        </div>
                                                                    </div>
                                                                    <p className='text-xs'>In-progress</p>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className='flex items-center space-x-2 bg-emerald-100 w-full h-full'>
                                                                    <FaRegCircleCheck className='text-emerald-700' />
                                                                    <p className='text-xs'>Completed</p>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className='flex items-center space-x-2 bg-red-100 w-full h-full'>
                                                                    <FaRegCircleXmark className='text-red-700' />
                                                                    <p className='text-xs'>Cancelled</p>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <p>{task.title}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SideBarTask;
