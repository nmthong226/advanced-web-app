//Import frameworks
import { useState } from 'react'

//Import icons
import { TbDragDrop2 } from "react-icons/tb";
import { ChevronsUpDown } from "lucide-react"
import { MdFolderOpen } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";

//Import components
import { Button } from "../../components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../components/ui/collapsible"
import DraggableItem from '../draggable/DraggableItem';

const SideBarDashboard = () => {
    const [isOpenCourses, setIsOpenCourses] = useState(false);
    const [isOpenActivities, setIsOpenActivities] = useState(false);
    return (
        <div className='flex flex-col w-[14%] h-full relative'>
            <div className="w-full h-full flex flex-col px-2 py-1 border-r-[1px] border-indigo-100 relative">
                <div className="flex justify-between items-center p-1.5 w-[90%] bg-gradient-to-t from-indigo-500 to-blue-400 text-white rounded-lg hover:cursor-default">
                    <p>Add an event</p>
                    <TbDragDrop2 className="size-5" />
                </div>
                <hr className="my-2 border-[1px]" />
                <div className='px-2 overflow-y-auto custom-scrollbar'>
                    <Collapsible
                        open={isOpenCourses}
                        onOpenChange={setIsOpenCourses}
                        className="w-full space-y-2"
                    >
                        <div className="flex items-center justify-between space-x-4 ">
                            <div className="flex space-x-2 items-center">
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="p-0">
                                        <ChevronsUpDown className="h-4 w-4" />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </CollapsibleTrigger>
                                <div className="flex items-center space-x-1">
                                    <MdFolderOpen />
                                    <h4 className="text-sm font-semibold">
                                        Courses
                                    </h4>
                                </div>
                            </div>
                            <div className="flex text-sm font-semibold text-indigo-600 hover:cursor-pointer">
                                <FiPlusCircle className='size-5 mr-1' />
                                Add
                            </div>
                        </div>
                        <DraggableItem text='Economics' type='course' />
                        <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-cyan-100 border-l-[5px] border-l-cyan-600 hover:cursor-grab">
                            Math
                        </div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-orange-100 border-l-[5px] border-l-orange-600 hover:cursor-grab">
                            History
                        </div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-pink-100 border-l-[5px] border-l-pink-600 hover:cursor-grab">
                            Psychology
                        </div>
                        <CollapsibleContent className="space-y-2">
                            <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-green-100 border-l-[5px] border-l-green-600 hover:cursor-grab">
                                Advanced Web Application Development
                            </div>
                            <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-sky-100 border-l-[5px] border-l-sky-600 hover:cursor-grab">
                                Game development
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    <hr className="my-2 border-[1px]" />
                    <Collapsible
                        open={isOpenActivities}
                        onOpenChange={setIsOpenActivities}
                        className="w-full space-y-2"
                    >
                        <div className="flex items-center justify-between space-x-4 ">
                            <div className="flex space-x-2 items-center">
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="p-0">
                                        <ChevronsUpDown className="h-4 w-4" />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </CollapsibleTrigger>
                                <div className="flex items-center space-x-1">
                                    <MdFolderOpen />
                                    <h4 className="text-sm font-semibold">
                                        Activities
                                    </h4>
                                </div>
                            </div>
                            <div className="flex text-sm font-semibold text-indigo-600 hover:cursor-pointer">
                                <FiPlusCircle className='size-5 mr-1' />
                                Add
                            </div>
                        </div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-red-50 border-l-[5px] border-l-red-600 hover:cursor-grab">
                            Morning Routine
                        </div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-yellow-50 border-l-[5px] border-l-yellow-600 hover:cursor-grab">
                            Lunch
                        </div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-indigo-50 border-l-[5px] border-l-indigo-600 hover:cursor-grab">
                            Workout
                        </div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-gray-50 border-l-[5px] border-l-gray-600 hover:cursor-grab">
                            Power Nap
                        </div>
                        <CollapsibleContent className="space-y-2">
                            <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-green-50 border-l-[5px] border-l-green-600 hover:cursor-grab">
                                Dinner
                            </div>
                            <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-red-50 border-l-[5px] border-l-red-600 hover:cursor-grab">
                                Me Time
                            </div>
                            <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-yellow-50 border-l-[5px] border-l-yellow-600 hover:cursor-grab">
                                Bedtime Routine
                            </div>
                            <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-pink-50 border-l-[5px] border-l-pink-600 hover:cursor-grab">
                                Laundry
                            </div>
                            <div className="rounded-md border px-4 py-3 font-mono text-sm truncate bg-violet-50 border-l-[5px] border-l-violet-600 hover:cursor-grab">
                                Brunch
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
            <div className='absolute p-2 bg-indigo-200 rounded-md -right-4 top-2 hover:cursor-pointer'>
                <FaChevronLeft />
            </div>
        </div>
    )
}

export default SideBarDashboard