//Import frameworks
import { useState } from 'react'

//Import icons
import { TbDragDrop2 } from "react-icons/tb";
import { ChevronsUpDown } from "lucide-react"
import { MdFolderOpen } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa";
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
                        <DraggableItem id='' title='Economics' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-purple-100 border-l-[5px] border-l-purple-600' textColor='text-purple-500' />
                        <DraggableItem id='' title='Math' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-cyan-100 border-l-[5px] border-l-cyan-600' textColor='text-cyan-500'/>
                        <DraggableItem id='' title='History' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-orange-100 border-l-[5px] border-l-orange-600' textColor='text-orange-500'/>
                        <DraggableItem id='' title='Psychology' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-pink-100 border-l-[5px] border-l-pink-600' textColor='text-pink-500'/>
                        <CollapsibleContent className="space-y-2">
                            <DraggableItem id='' title='Advanced Web Application Development' type='activity' description='' startTime='' duration={60} endTime='' date='' backgroundColor='bg-green-100 border-l-[5px] border-l-green-600' textColor='text-green-500'/>
                            <DraggableItem id='' title='Game development' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-sky-100 border-l-[5px] border-l-sky-600' textColor='text-sky-500'/>
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
                        <DraggableItem id='' title='Morning Routine' type='activity' description='a' startTime='' endTime='' date='' duration={60} backgroundColor='bg-red-50 border-l-[5px] border-l-red-600' textColor='text-red-500'/>
                        <DraggableItem id='' title='Lunch' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-yellow-50 border-l-[5px] border-l-yellow-600' textColor='text-yellow-500'/>
                        <DraggableItem id='' title='Workout' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-indigo-50 border-l-[5px] border-l-indigo-600' textColor='text-indigo-500'/>
                        <DraggableItem id='' title='Power Nap' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-gray-50 border-l-[5px] border-l-gray-600' textColor='text-gray-500'/>
                        <CollapsibleContent className="space-y-2">
                            <DraggableItem id='' title='Dinner' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-green-50 border-l-[5px] border-l-green-600' textColor='text-green-500'/>
                            <DraggableItem id='' title='Me Time' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-red-50 border-l-[5px] border-l-red-600' textColor='text-red-500'/>
                            <DraggableItem id='' title='Bedtime Routine' type='activity' description='' startTime='' endTime='' duration={60} date='' backgroundColor='bg-yellow-50 border-l-[5px] border-l-yellow-600' textColor='text-yellow-500'/>
                            <DraggableItem id='' title='Laundry' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-pink-50 border-l-[5px] border-l-pink-600' textColor='text-pink-500'/>
                            <DraggableItem id='' title='Brunch' type='activity' description='' startTime='' endTime='' date='' duration={60} backgroundColor='bg-violet-50 border-l-[5px] border-l-violet-600' textColor='text-violet-500'/>
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