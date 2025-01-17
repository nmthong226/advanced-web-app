import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { FaRegCircle, FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { BiSolidCircleQuarter } from "react-icons/bi";
import { GoArrowDown, GoArrowRight, GoArrowUp } from "react-icons/go";
import axios from "axios";
import { useTaskContext } from "@/contexts/UserTaskContext";
import { IoTrashBinOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useTasksContext } from "../../components/table/context/task-context";
import { Button } from "../../components/ui/button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EventTrigger {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCloseChange: () => void;
    selectedEvent: any; // Add selected event prop
    setMyEvents: (events: any) => void
    setSelectedEvent: (event: any) => void; // Correct type for the setter
    handleConfirm: () => void
}

const EventCalendar: React.FC<EventTrigger> = ({ open, onOpenChange, onCloseChange, selectedEvent, setMyEvents, setSelectedEvent, handleConfirm }) => {
    const { setTasks } = useTaskContext();
    // Utility function to format the time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}h${minutes}`;
    };

    // Utility function to calculate duration
    const calculateDuration = (start: string, end: string) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const durationInMs = endTime.getTime() - startTime.getTime();

        const durationInMinutes = Math.floor(durationInMs / (1000 * 60));
        const durationInHours = Math.floor(durationInMinutes / 60);
        const durationInDays = Math.floor(durationInHours / 24);

        if (durationInDays >= 1) {
            const hoursRemainder = durationInHours % 24;
            return `${durationInDays}day ${hoursRemainder ? ` ${hoursRemainder} h` : ''}`;
        } else if (durationInHours >= 1) {
            const minutesRemainder = durationInMinutes % 60;
            return `${durationInHours}h ${minutesRemainder ? ` ${minutesRemainder}m` : ''}`;
        } else {
            return `${durationInMinutes}m`;
        }
    };

    // Utility function to format the date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }); // Get abbreviated month (e.g., "Jan")
        return `${day} ${month}`;
    };

    // Calculate and format the desired output
    const formattedEvent = selectedEvent
        ? {
            startTime: formatTime(selectedEvent.start),
            endTime: formatTime(selectedEvent.end),
            date: formatDate(selectedEvent.start),
            duration: calculateDuration(selectedEvent.start, selectedEvent.end),
        }
        : null;

    const { handleOpen } = useTasksContext();


    // Handle status selection
    const onSelectStatus = async (status: string) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/tasks/${selectedEvent._id}/status`,
                { status }, // Payload
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                const returnedEvent = response.data; // Get updated event data from the server

                // Update tasks in context
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === returnedEvent?._id ? returnedEvent : task
                    )
                );

                // Update `myEvents` state
                setMyEvents((prevEvents: any) =>
                    prevEvents.map((event: any) =>
                        event.id === returnedEvent._id ? returnedEvent : event
                    )
                );

                setSelectedEvent((prev: any) => {
                    // Ensure the previous state exists and update only the status
                    if (prev) {
                        return { ...prev, status: returnedEvent.status };
                    }
                    return prev; // If no event is selected, return null
                });
            } else {
                console.error("Failed to update status:", response.statusText);
            }
        } catch (error: any) {
            console.error("Error updating status:", error?.response?.data || error.message);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={(isOpen) => {
                onOpenChange(isOpen);
                if (!isOpen) {
                    onCloseChange();
                }
            }}>
                <DialogContent className="flex flex-col custom-scrollbar min-w-[600px] max-h-[100vh] overflow-y-auto [&>button]:hidden dark:bg-slate-700" bgOverlay='bg-black/20'>
                    <DialogHeader>
                        <DialogTitle className='text-lg'>
                            {/* Title Field */}
                            <div className="flex items-center space-x-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='mx-1 outline-none'>
                                        <div className='flex items-center space-x-1 w-full h-full'>
                                            <div className='hover:bg-slate-200 px-0.5 hover:cursor-pointer'>
                                                {selectedEvent?.status === 'pending' && (
                                                    <FaRegCircle className='text-purple-700' />
                                                )}
                                                {selectedEvent?.status === 'in-progress' && (
                                                    <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                                                        <div className="flex justify-center items-center rounded-full w-4 h-4">
                                                            <BiSolidCircleQuarter className="text-blue-700" />
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedEvent?.status === 'completed' && (
                                                    <FaRegCircleCheck className='text-emerald-700' />
                                                )}
                                                {selectedEvent?.status === 'expired' && (
                                                    <FaRegCircleXmark className='text-red-700' />
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='space-y-1'>
                                        <DropdownMenuItem
                                            className='flex items-center space-x-2 bg-purple-100 w-full h-full'
                                            onClick={() => onSelectStatus('pending')}
                                        >
                                            <FaRegCircle className='text-purple-700' />
                                            <p className='text-xs'>Pending</p>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='flex items-center space-x-2 bg-blue-100 w-full h-full'
                                            onClick={() => onSelectStatus('in-progress')}
                                        >
                                            <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                                                <div className="flex justify-center items-center rounded-full w-4 h-4">
                                                    <BiSolidCircleQuarter className="text-blue-700" />
                                                </div>
                                            </div>
                                            <p className='text-xs'>In-progress</p>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='flex items-center space-x-2 bg-emerald-100 w-full h-full'
                                            onClick={() => onSelectStatus('completed')}
                                        >
                                            <FaRegCircleCheck className='text-emerald-700' />
                                            <p className='text-xs'>Completed</p>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='flex items-center space-x-2 bg-red-100 w-full h-full'
                                            onClick={() => onSelectStatus('expired')}
                                        >
                                            <FaRegCircleXmark className='text-red-700' />
                                            <p className='text-xs'>Cancelled</p>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <div>{selectedEvent?.title}</div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col">
                        {/* Date Fields */}
                        <div className="flex justify-between items-center w-full">
                            {/* Date Fields */}
                            <div className={`flex space-x-2 space-y-0 mr-4`}>
                                <p className="flex items-center bg-zinc-100 dark:bg-slate-800 px-3 p-1 border rounded-md h-8 text-[12px] text-center">
                                    {formattedEvent?.startTime} - {formattedEvent?.endTime} {formattedEvent?.date}
                                    {" "}({formattedEvent?.duration})
                                </p>
                            </div>
                            <div
                                className="flex items-center space-y-0 bg-white dark:bg-slate-800 shadow-sm px-2 border rounded-md h-8 hover:cursor-pointer"
                                onClick={() => handleOpen("update")}
                            >
                                <CiEdit className="mr-1 hover:cursor-pointer size-5" />
                                <p className="text-[12px] text-muted-foreground">Edit</p>
                            </div>
                        </div>
                        <hr className="dark:border-slate-400 my-2 border-t-1 w-full" />
                        <div className='flex flex-col justify-between w-full'>
                            {/* Task Description Field */}
                            <div className="flex flex-col custom-scrollbar h-24 overflow-y-auto">
                                {selectedEvent?.description ? (
                                    <ReactQuill
                                        value={selectedEvent.description}
                                        readOnly={true}
                                        theme="bubble" // A clean and read-only theme for rendering
                                    />
                                ) : (
                                    <p className="text-[12px] text-gray-500">No description</p>
                                )}
                            </div>
                            <hr className="dark:border-slate-400 my-2 border-t-1 w-full" />
                            <div className='flex flex-row justify-between space-x-2'>
                                <div className="flex flex-row space-x-2">
                                    {/* Priority Field */}
                                    <div className="flex items-center space-y-0 bg-white dark:bg-slate-800 shadow-sm px-2 border rounded-md h-8">
                                        <div className="flex items-center space-x-2 text-[12px]">
                                            {selectedEvent?.priority === 'low' && <GoArrowDown className="mr-1" />}
                                            {selectedEvent?.priority === 'medium' && <GoArrowRight className="mr-1" />}
                                            {selectedEvent?.priority === 'high' && <GoArrowUp className="mr-1" />}
                                            {selectedEvent?.priority || 'No priority'}
                                        </div>
                                    </div>
                                    {/* Category Field */}
                                    <div className="flex justify-center items-center bg-white dark:bg-slate-800 shadow-sm px-2 border rounded-md h-8">
                                        {selectedEvent?.category === 'leisure' && <p className="mb-1 text-sm">🧩</p>}
                                        {selectedEvent?.category === 'work' && <p className="mb-1 text-sm">💼</p>}
                                        {selectedEvent?.category === 'personal' && <p className="mb-1 text-sm">🪅</p>}
                                        {selectedEvent?.category === 'urgent' && <p className="mb-1 text-sm">💥</p>}
                                        <div className="text-[12px] capitalize">{selectedEvent?.category || 'Uncategorized'}</div>
                                    </div>
                                    {/* Due Date Field */}
                                    <div className="flex items-center space-y-0 bg-white dark:bg-slate-800 shadow-sm px-2 border rounded-md h-8">
                                        <div className="text-[12px]">
                                            <p>Due:</p>
                                        </div>
                                        <div>
                                            {selectedEvent?.dueDate ? (
                                                <Input
                                                    type="datetime-local"
                                                    value={selectedEvent?.dueDate}
                                                    className="border-0 shadow-none px-1 md:text-[12px]"
                                                />
                                            ) : (
                                                <div
                                                    className="px-1 text-gray-500 md:text-[12px] cursor-pointer"
                                                >
                                                    No due date
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Dialog>
                                    <DialogTrigger>
                                        <div
                                            className="flex items-center space-y-0 bg-white dark:bg-slate-800 shadow-sm px-2 border rounded-md h-8 hover:cursor-pointer">
                                            <IoTrashBinOutline className="text-muted-foreground" />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent
                                        onCloseAutoFocus={() => {
                                            onOpenChange(false); // Close the parent dialog when delete dialog is closed
                                        }}
                                    >
                                        <DialogHeader>
                                            <DialogTitle>Confirm Delete</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => onOpenChange(false)} // Close parent dialog explicitly
                                                >
                                                    Close
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                variant={'destructive'}
                                                onClick={() => {
                                                    handleConfirm();
                                                    onOpenChange(false); // Close parent dialog after confirm
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EventCalendar;
