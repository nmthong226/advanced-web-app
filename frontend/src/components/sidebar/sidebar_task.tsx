import { useState } from 'react'

//Import components
import { Button } from '../../components/ui/button.tsx';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../../components/ui/collapsible.tsx';
import DraggableTask from '../draggable/DraggableTask.tsx';

//Import icons
import { IoSearchSharp } from 'react-icons/io5';
import { MdFilterAlt } from 'react-icons/md';
import { MdSort } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';
import { RiFireFill } from 'react-icons/ri';
import { IoCalendarOutline } from 'react-icons/io5';
import { ChevronsUpDown } from 'lucide-react';

//Import mock data
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';

const SideBarTask = () => {
    const [isOpenTask, setIsOpenTask] = useState(false);
    const { tasks } = useTaskContext();

    const UserTasks = tasks.filter(task => task.status !== 'completed');

    return (
        <div className='flex flex-col space-y-2 bg-white p-2 border rounded-lg w-[16%] h-full'>
            <button className='flex items-center space-x-2 bg-gradient-to-t from-indigo-500 to-blue-400 px-2 p-1.5 border rounded-md w-full text-white'>
                <FiPlusCircle />
                <p>Add a task</p>
            </button>
            <hr className="border-[1px] my-2" />
            <div className='relative flex bg-gray-100 p-2 rounded-lg w-full'>
                <IoSearchSharp className='top-1/2 left-2 absolute transform -translate-y-1/2' />
                <input
                    type='text'
                    className='bg-gray-100 pl-8 rounded-lg w-[70%] h-full text-sm focus:outline-none'
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
                <button className='flex items-center space-x-2 px-2 p-2 border rounded-md w-full text-red-500 text-sm'>
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
                </Collapsible>
                <div className='flex flex-col space-y-3 pr-1 w-full max-h-full'>
                    {UserTasks.map(task => (
                        <DraggableTask
                            key={task._id}
                            id={task._id}
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
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SideBarTask