import { useState } from 'react'

//Import components
import { Button } from '../../components/ui/button.tsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../components/ui/collapsible.tsx';

//Import icons
import { IoSearchSharp } from 'react-icons/io5';
import { MdFilterAlt } from 'react-icons/md';
import { MdSort } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';
import { RiFireFill } from 'react-icons/ri';
import { IoCalendarOutline } from 'react-icons/io5';
import { ChevronsUpDown } from 'lucide-react';
import { FaFlagCheckered } from 'react-icons/fa';
import DraggableTask from '../draggable/DraggableTask.tsx';

const SideBarTask = () => {
    const [isOpenTask, setIsOpenTask] = useState(false);
    return (
        <div className='flex flex-col space-y-2 bg-white p-2 border rounded-lg w-[16%] h-full'>
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
                <button className='flex items-center space-x-2 px-2 p-2 border rounded-md w-full text-indigo-500 text-sm'>
                    <FiPlusCircle />
                    <p>Add a task</p>
                </button>
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
                <div className='flex flex-col space-y-2 px-2 py-3 border rounded-lg w-full text-sm text-zinc-600'>
                    <div>
                        Due: <span className='font-semibold'>Thursday</span>
                    </div>
                    <DraggableTask id='task-001' title='Home Work 02' description='Assignment' startTime='Dec 12, 12:00pm' endTime='Dec 12, 15:00pm' backgroundColor='bg-purple-100 border border-l-[5px] border-l-purple-600' textColor='text-purple-600' activity='Game Development' status='pending' />
                    <DraggableTask id='task-002' title='Presentation' description='Group Project' startTime='Dec 10' endTime='Dec 12, 23:55pm' backgroundColor='bg-blue-100 border border-l-[5px] border-l-blue-600' textColor='text-blue-600' activity='Intro2DE' status='pending'/>
                </div>
                <div className='flex flex-col space-y-2 px-2 py-3 border rounded-lg w-full text-sm text-zinc-600'>
                    <div>
                        Due: <span className='font-semibold'>Tuesday</span>
                    </div>
                    <div className='relative flex flex-col space-y-1 bg-green-100 px-2 py-3 border border-l-[5px] border-l-green-600 rounded-md font-mono text-sm truncate hover:cursor-grab'>
                        <div className='flex text-[11px] truncate'>
                            <p className='font-bold truncate'>AWP</p>
                            <p>|</p>
                            <p className='truncate'>Group Project</p>
                        </div>
                        <p className='font-bold text-lg truncate'>Seminar Proposal</p>
                        <div className='flex flex-col text-[11px] leading-tight'>
                            <p>
                                Start: <span className='ml-1 font-bold'>Nov 23</span>
                            </p>
                            <p>
                                Due: <span className='ml-4 font-bold'>Nov 26, 23:55pm</span>
                            </p>
                        </div>
                        <div className='right-2 bottom-2 absolute flex justify-center items-center font-bold text-[11px] text-emerald-400'>
                            <FaFlagCheckered />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBarTask