///Import frameworks
import React from 'react';
//Import libs
import { addMinutesToTime, cn, formatTimeRange } from '@/lib/utils';
//Import packages
import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';
//Import components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
//Import icons
import { GoPencil } from "react-icons/go";
import { Button } from '../ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { GoTrash } from "react-icons/go";


type CalendarCellProps = {
    time: string;
    activity?: Activity;
    date: string;
    className: string;
    style: React.CSSProperties;
    rowSpan: number;
    onDrop: (item: Activity, time: string, date: string) => void;
    onResize: (id: string, date: string, newDuration: number) => void;
};

const CalendarCell: React.FC<CalendarCellProps> = ({
    date,
    time,
    activity,
    onDrop,
    className,
    onResize,
    rowSpan
}) => {
    const [{ isOver }, drop] = useDrop<Activity, void, { isOver: boolean }>({
        accept: 'ITEM',
        drop: (item) => {
            // Ensure the dropped item matches the current activity
            if (item.id === activity?.id) {
                const updatedEndTime = addMinutesToTime(time, 60);
                const updatedItem = {
                    ...item,
                    startTime: time,
                    endTime: updatedEndTime,
                    date: date,
                };
                onDrop(updatedItem, time, date);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            className={cn(
                `relative flex h-full bg-gray-50 p-1 ${isOver ? 'bg-indigo-100' : 'bg-gray-50 p-1'}`,
                activity?.style.backgroundColor,
                className
            )}
        >
            {activity && (
                <Rnd
                    size={{
                        width: '100%', // Adjust width as necessary
                        height: '100%', // Set initial height based on activity duration
                    }}
                    position={{ x: 1, y: 3 }}
                    onResizeStop={(_e, _direction, ref, _delta, _position) => {
                        // Only proceed if the resized activity matches the active one
                        const newHeight = ref.offsetHeight;
                        const newDuration = Math.max(15, Math.floor(newHeight / 20) * 15); // Calculate new duration based on height
                        onResize(activity.id, date, newDuration);
                    }}
                    minWidth={100} // Minimum width for resizing (can be customized)
                    minHeight={20} // Minimum height for resizing (can be customized)
                    enableResizing={{
                        top: false,
                        right: false,
                        bottom: true,
                        left: false,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false,
                    }}
                    disableDragging={true} // Disable dragging to prevent moving the activity around
                    className={`${activity?.style.backgroundColor} ${className} z-10 group`}
                >
                    {rowSpan === 1 ?
                        (
                            <div className='flex flex-row justify-center items-center'>
                                <p className={cn(`text-[10px] font-semibold`, activity.style.textColor)}>
                                    {activity ? formatTimeRange(activity.startTime, activity.endTime) : ''} 
                                </p>
                                <span className='mx-1'> - </span>
                                <p className="text-[10px] font-bold text-zinc-600 truncate">{activity.title}</p>
                            </div>
                        ) : (
                            <div className='flex flex-col p-2'>
                                <p className={cn(`text-[10px] font-semibold`, activity.style.textColor)}>
                                    {activity ? formatTimeRange(activity.startTime, activity.endTime) : ''}
                                </p>
                                <p className="text-sm font-bold text-zinc-600">{activity.title}</p>
                            </div>
                        )
                    }
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className='absolute top-0 right-0 w-6 h-6 bg-white items-center justify-center border-zinc-300 border-[1px] rounded-full group-hover:flex hidden hover:cursor-pointer'>
                                <GoPencil />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        defaultValue="Pedro Duarte"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        defaultValue="@peduarte"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className={`${rowSpan < 3 ? "hidden" : "group-hover:flex hidden"}  absolute bottom-0 right-0 w-6 h-6 bg-white items-center justify-center border-zinc-300 border-[1px] rounded-full hover:cursor-pointer`}>
                                <GoTrash />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        defaultValue="Pedro Duarte"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        defaultValue="@peduarte"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Rnd>
            )}
        </div>
    );
};

export default CalendarCell;
