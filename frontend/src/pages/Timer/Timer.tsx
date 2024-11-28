// Import frameworks
import { useEffect, useState } from 'react';

//Import components
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

// Import icons
import { FaRegChartBar } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { GiTomato } from "react-icons/gi";
import { IoMdMore } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import {
    Trash,
    Trash2,
} from "lucide-react"
import { BsFillSkipEndFill } from "react-icons/bs";
import { LuClock2 } from "react-icons/lu";
import { BsListTask } from "react-icons/bs";
import { AiOutlineSound } from "react-icons/ai";
import { GiStarShuriken } from "react-icons/gi";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";

const Timer = () => {
    // State to keep track of the current mode
    const [mode, setMode] = useState('pomodoro'); // Can be 'pomodoro', 'shortBreak', 'longBreak'
    const [time, setTime] = useState(1500); // Time in seconds (25 minutes default for Pomodoro)
    const [isActive, setIsActive] = useState(false); // To manage the timer state (active/inactive)

    // Function to handle background color based on the mode
    // Function to handle background color based on the mode
    const getBackgroundColor = () => {
        switch (mode) {
            case 'shortBreak':
                return 'bg-[#368356]/10 transition-colors duration-500';
            case 'longBreak':
                return 'bg-blue-100 transition-colors duration-500';
            default:
                return 'bg-red-100 transition-colors duration-500';
        }
    };

    const startButtonColor = () => {
        switch (mode) {
            case 'shortBreak':
                return 'bg-[#368356]/70';
            case 'longBreak':
                return 'bg-blue-700/70';
            default:
                return 'bg-red-700/70';
        }
    }

    const addTaskButtonColor = () => {
        switch (mode) {
            case 'shortBreak':
                return 'bg-[#368356]/60';
            case 'longBreak':
                return 'bg-blue-600/60';
            default:
                return 'bg-red-600/60';
        }
    }

    // Function to format the time in mm:ss
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Function to set the default time based on the mode
    const getDefaultTime = (mode: string) => {
        if (mode === 'pomodoro') return 1500; // 25 minutes
        if (mode === 'shortBreak') return 300; // 5 minutes
        if (mode === 'longBreak') return 900; // 15 minutes
        return 1500; // Default to Pomodoro time
    };

    // Update timer based on the mode selected
    const handleModeChange = (newMode: string) => {
        setMode(newMode);
        setIsActive(false); // Pause the timer when changing modes
        setTime(getDefaultTime(newMode)); // Reset the timer to the new mode's default time
    };

    const handleModeTitle = (mode: string) => {
        switch (mode) {
            case 'pomodoro':
                return 'Time to focus!';
            case 'shortBreak':
                return 'Short Break';
            case 'longBreak':
                return 'Long Break';
            default:
                return 'Time to focus!';
        }
    }
    // Timer effect
    useEffect(() => {
        let interval = null;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            // Timer has ended, you can trigger some event here
            setIsActive(false); // Stop the timer when it reaches 0
        }
        return () => clearInterval(interval as NodeJS.Timeout);
    }, [isActive, time]);

    // Update document title when time changes
    useEffect(() => {
        document.title = `${formatTime(time)} - ${handleModeTitle(mode)}`;
    }, [time]);

    return (
        <div className={`flex w-full h-full ${getBackgroundColor()} overflow-y-auto custom-scrollbar relative`}>
            <div className="flex flex-col w-full h-full justify-start items-center">
                <div className="flex w-full px-8 py-1 justify-center items-center bg-white/60">
                    <div className="flex justify-between w-[500px] py-1">
                        {/* Track the time that user focus: total time, longest time */}
                        <div className="flex justify-center items-center text-lg font-bold text-zinc-700">
                            <GiTomato className="mr-2" />
                            <p>Pomofocus</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="flex items-center rounded-md p-1 px-4 bg-white/70 text-zinc-700 font-semibold">
                                <FaRegChartBar className="mr-2" />
                                Report
                            </button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="flex items-center rounded-md p-1 px-4 bg-white/70 text-zinc-700 font-semibold">
                                        <IoMdSettings className="mr-2" />
                                        Settings
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col sm:max-w-[425px] sm:max-h-[425px] items-center">
                                    <DialogHeader className='items-center'>
                                        <DialogTitle>Settings</DialogTitle>
                                        <DialogDescription>
                                            Set up your Pomo Focus
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Tabs defaultValue="timer" className="w-[400px] h-[400px]">
                                        <TabsList className='flex w-full justify-between'>
                                            <TabsTrigger value="timer">
                                                <div className='flex items-center w-[60px]'>
                                                    <LuClock2 className='mr-2' />
                                                    <p>Timer</p>
                                                </div>
                                            </TabsTrigger>
                                            <TabsTrigger value="task">
                                                <div className='flex items-center w-[60px]'>
                                                    <BsListTask className='mr-2' />
                                                    <p>Tasks</p>
                                                </div>
                                            </TabsTrigger>
                                            <TabsTrigger value="sound">
                                                <div className='flex items-center w-[60px]'>
                                                    <AiOutlineSound className='mr-2' />
                                                    <p>Sound</p>
                                                </div>
                                            </TabsTrigger>
                                            <TabsTrigger value="theme">
                                                <div className='flex items-center w-[60px]'>
                                                    <GiStarShuriken className='mr-2' />
                                                    <p>Theme</p>
                                                </div>
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="timer">
                                            <div className='flex flex-col h-full w-full my-5 space-y-4'>
                                                <Label className='flex w-[30%]'>Time (minutes)</Label>
                                                <div className='flex w-full justify-between'>
                                                    <div className='flex flex-col w-[30%] space-y-1'>
                                                        <Label className="flex text-black/60 text-sm">Pomodoro</Label>
                                                        <div className="flex items-center p-1 px-2 bg-gray-100 rounded-md">
                                                            <span className="flex-grow">12</span>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <IoMdArrowDropup className="cursor-pointer hover:text-gray-800 hover:bg-gray-400 rounded-sm" />
                                                                <IoMdArrowDropdown className="cursor-pointer hover:text-gray-800 hover:bg-gray-400 rounded-sm" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col w-[30%] space-y-1">
                                                        <Label className="flex text-black/60 text-sm">Short Break</Label>
                                                        <div className="flex items-center p-1 px-2 bg-gray-100 rounded-md">
                                                            <span className="flex-grow">12</span>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <IoMdArrowDropup className="cursor-pointer hover:text-gray-800 hover:bg-gray-400 rounded-sm" />
                                                                <IoMdArrowDropdown className="cursor-pointer hover:text-gray-800 hover:bg-gray-400 rounded-sm" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col w-[30%] space-y-1'>
                                                        <Label className="flex text-black/60 text-sm">Long Break</Label>
                                                        <div className="flex items-center p-1 px-2 bg-gray-100 rounded-md">
                                                            <span className="flex-grow">12</span>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <IoMdArrowDropup className="cursor-pointer hover:text-gray-800 hover:bg-gray-400 rounded-sm" />
                                                                <IoMdArrowDropdown className="cursor-pointer hover:text-gray-800 hover:bg-gray-400 rounded-sm" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="task">Change your task here.</TabsContent>
                                        <TabsContent value="sound">Change your sound here.</TabsContent>
                                        <TabsContent value="theme">Change your theme here.</TabsContent>
                                    </Tabs>
                                    <DialogFooter className='flex w-full justify-end'>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-10">
                    <div className="flex flex-col justify-between items-center w-[500px] h-[300px] bg-white/60 rounded-lg shadow-md p-2 py-4">
                        <div className="flex space-x-4 w-full justify-center text-sm">
                            <button
                                onClick={() => handleModeChange('pomodoro')}
                                className={`p-1 px-4 rounded-md font-bold ${mode === 'pomodoro' ? 'bg-red-600/60 text-white' : 'text-[#5f341f]'}`}
                            >
                                Pomodoro
                            </button>
                            <button
                                onClick={() => handleModeChange('shortBreak')}
                                className={`p-1 px-4 rounded-md font-bold ${mode === 'shortBreak' ? 'bg-green-600/60 text-white' : 'text-[#5f341f]'}`}
                            >
                                Short Break
                            </button>
                            <button
                                onClick={() => handleModeChange('longBreak')}
                                className={`p-1 px-4 rounded-md font-bold ${mode === 'longBreak' ? 'bg-blue-600/60 text-white' : 'text-[#5f341f]'}`}
                            >
                                Long Break
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <p className="text-8xl font-semibold text-[#5f341f]">{formatTime(time)}</p>
                        </div>
                        <div className='flex w-[50%] h-10 justify-center items-center relative'>
                            {/* <button className='flex absolute -left-16 hover:bg-white hover:rounded-full p-1'>
                                <FaArrowRotateLeft className='w-5 h-5 text-[#5f341f]' />
                            </button> */}
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`w-full h-full p-1 px-4 rounded-md ${startButtonColor()} text-white text-lg font-semibold outline-none`}>
                                <p>{isActive ? 'Pause' : 'Start'}</p>
                            </button>
                            <button
                                className={`${isActive ? 'opacity-100' : 'opacity-0'} 
                                flex absolute -right-16 hover:bg-white hover:rounded-full p-1 transition-opacity duration-300`}
                            >
                                <BsFillSkipEndFill className='w-5 h-5 text-[#5f341f] ' />
                            </button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center mt-6'>
                    <p className='text-[#5f341f] text-lg font-bold'>#1</p>
                    <p className='text-[#5f341f]'>{handleModeTitle(mode)}</p>
                </div>
                <div className='flex flex-col items-center justify-center mt-3 space-y-5'>
                    <div className='flex w-[500px] h-full justify-between items-center border-b-2 border-white py-2'>
                        <p className='text-lg font-bold text-[#5f341f]'>Tasks</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div>
                                    <button className='p-1 bg-white/60 rounded-md'>
                                        <IoMdMore className='h-6 w-6' />
                                    </button>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 absolute -right-4">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Trash />
                                        <span>Delete all tasks</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Trash2 />
                                        <span>Clear finished tasks</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <div>
                                <button className={`flex w-[500px] items-center justify-center px-4 py-2 ${addTaskButtonColor()} hover:brightness-105 rounded-lg text-white/70 text-lg font-semibold`}>
                                    <IoAddCircle className='mr-2' />
                                    <p>Add Task</p>
                                </button>
                            </div>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>New Task</SheetTitle>
                                <SheetDescription>
                                    <p>Add your task with pomodoro here!</p>
                                    <p>Click save when you're done.</p>
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-left">
                                        Name<span className='text-red-600'>*</span>
                                    </Label>
                                    <Input id="name" value="" placeholder='what are you working on' className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-left">
                                        Description
                                    </Label>
                                    <Input id="username" value="" placeholder='optional' className="col-span-3" />
                                </div>
                                <span className='text-xs italic text-end'>* required</span>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit">Add New Task</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}

export default Timer;
