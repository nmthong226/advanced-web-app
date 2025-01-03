//Import frameworks
import React, { useEffect, useState } from 'react';

//Import components
import DraggableTask from '../draggable/Task/WeekMode/DraggableTask.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { TasksMutateDrawer } from '../../components/table/ui/tasks-mutate-drawer.tsx';

//Import icons
import { IoSearchSharp } from 'react-icons/io5';
import { MdFilterAlt } from 'react-icons/md';
import { MdSort } from 'react-icons/md';
import { GiEmptyChessboard } from "react-icons/gi";
import { MdTaskAlt } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { GoTag } from "react-icons/go";

//Import context
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';
import { useTasksContext } from '../table/context/task-context.tsx';


const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);

const SideBarTask = () => {
    const { tasks } = useTaskContext();
    const [loading, setLoading] = useState(true);
    const { handleOpen } = useTasksContext();

    // Filter tasks where status is 'completed' or isOnCalendar is true
    const filteredTasks = tasks.filter(
        (task) => task.status !== 'completed' && task.isOnCalendar !== true
    );

    // Simulate data fetching
    useEffect(() => {
        const fetchTasks = () => {
            // Simulating a delay
            setTimeout(() => {
                setLoading(false);
            }, 1000); // Adjust the delay as needed
        };

        fetchTasks();
    }, []);

    return (
        <div className='flex flex-col space-y-2 bg-white dark:bg-slate-700 p-2 border rounded-lg w-[16%] h-full'>
            <div className='flex justify-between items-center space-x-2 bg-gradient-to-t from-indigo-500 to-blue-400 py-1.5 pl-2 border rounded-md w-full text-white'>
                <button
                    className='flex justify-center items-center space-x-2 w-full text-center'
                    onClick={() => handleOpen('create')} >
                    <p className='text-center'>Add Task</p>
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger className='outline-none'>
                        <div className='flex justify-center items-center border-l w-8'>
                            <IoIosArrowDown className='size-5' />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='mt-2 mr-[182px] w-[214px]'>
                        <DropdownMenuItem className='flex items-center'>
                            <MdTaskAlt />
                            Add Task
                        </DropdownMenuItem>
                        <DropdownMenuItem className='flex items-center'>
                            <GoTag /> Add Tag
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <MemoizedTasksMutateDrawer />
            <hr className="border-[1px] my-2" />
            <div className='relative flex bg-gray-100 dark:bg-slate-600 p-2 rounded-lg w-full'>
                <IoSearchSharp className='top-1/2 left-2 absolute transform -translate-y-1/2' />
                <input
                    type='text'
                    className='bg-gray-100 dark:bg-slate-600 pl-8 rounded-lg w-[70%] h-full text-sm focus:outline-none'
                    placeholder='Search...'
                />
                <div className='top-1/2 right-2 absolute flex space-x-2 transform -translate-y-1/2'>
                    <button className='bg-indigo-600 p-1 rounded-md'>
                        <MdFilterAlt className='text-white' />
                    </button>
                    <button className='bg-indigo-600 p-1 rounded-md'>
                        <MdSort className='text-white' />
                    </button>
                </div>
            </div>
            <div className='flex flex-col space-y-2 custom-scrollbar overflow-y-auto'>
                {/* <button className='flex items-center space-x-2 px-2 p-2 border rounded-md w-full text-red-500 text-sm'>
                    <RiFireFill />
                    <p>Overdue (10)</p>
                </button>
                <Collapsible
                    open={isOpenTask}
                    onOpenChange={setIsOpenTask}
                    className='space-y-2 w-full'
                >
                    <div className='flex items-center'>
                        <div className='flex justify-between items-center p-2 border rounded-md w-full text-sm'>
                            <div className='flex items-center space-x-2 text-zinc-500'>
                                <IoCalendarOutline />
                                <h4 className='font-semibold text-sm'>No due date (4)</h4>
                            </div>
                            <CollapsibleTrigger asChild>
                                <Button variant='ghost' size='sm' className='p-0'>
                                    <ChevronsUpDown className='w-4 h-4' />
                                    <span className='sr-only'>Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                    <CollapsibleContent className='space-y-2'>
                        <div className='bg-gray-100 px-4 py-3 border border-l-[5px] rounded-md font-mono text-sm truncate hover:cursor-grab'>
                            Now empty
                        </div>
                    </CollapsibleContent>
                </Collapsible> */}
                <div className='flex flex-col space-y-3 w-full max-h-full'>
                    {loading ? (
                        <div className='flex justify-center items-center h-full'>
                            <div className='loader'></div>
                            <p className='ml-2 text-sm text-zinc-500'>Loading tasks...</p>
                        </div>
                    ) : (
                        <>
                            {filteredTasks.length === 0 && (
                                <div className='flex flex-col items-center space-x-2 space-y-2 px-2 p-2 w-full text-sm text-zinc-500'>
                                    <GiEmptyChessboard className='size-10' />
                                    <p className='text-xs'>No tasks available for you yet.</p>
                                </div>
                            )}
                            {filteredTasks.map(task => (
                                <DraggableTask
                                    key={task._id}
                                    _id={task._id}
                                    title={task.title}
                                    description={task?.description}
                                    startTime={task.startTime || 'No Info'}
                                    endTime={task.endTime || '15:00 PM'}
                                    dueTime={task.dueTime}
                                    backgroundColor={task.style.backgroundColor || ''}
                                    textColor={task.style.textColor || ''}
                                    activity={task.category}
                                    status={task.status || 'pending'}
                                    priority={task.priority}
                                    estimatedTime={task.estimatedTime}
                                    isOnCalendar={task.isOnCalendar}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SideBarTask