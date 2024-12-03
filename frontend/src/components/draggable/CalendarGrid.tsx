import { useState } from 'react';
import CalendarCell from "./CalendarCell";
import { addMinutesToTime, formatTime, getCurrentWeek } from '@/lib/utils';
import { initialCalendarData } from '@/mocks/MockData';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

//Import icons
import { RxCountdownTimer } from "react-icons/rx";

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
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// Define the type for the draggable item.
const CalendarGrid = () => {
    // Get current week
    const currentWeek = getCurrentWeek();
    // Use state to track items dropped in specific hours
    const [calendarData, setCalendarData] = useState<CalendarData>(initialCalendarData);

    const handleDrop = (item: Activity, time: string, date: string) => {
        console.log(`Item dropped at ${time} on ${date}:`, item);
        setCalendarData((prevData) => {
            const updatedData = prevData.map((day) => {
                if (day.date === date) {
                    const newItem = {
                        ...item,
                        id: item.id || uuidv4(), // Use provided ID or generate a new one
                        startTime: time,
                        endTime: addMinutesToTime(time, 60), // Example end time (can be adjusted)
                        date: date,
                    };
                    const updatedActivities = [...day.schedule.activies, newItem];
                    return {
                        ...day,
                        schedule: {
                            ...day.schedule,
                            activies: updatedActivities,
                        },
                    };
                }
                return day; // If the date doesn't match, return the day unchanged
            });
            return updatedData;
        });
    };

    const handleResize = (id: string, date: string, newDuration: number) => {
        // Find the activity in the data and adjust its duration
        setCalendarData((prevData) =>
            prevData.map((day) => {
                if (day.date === date) {
                    const updatedActivities = day.schedule.activies.map((act) => {
                        if (act.id === id) { // Match by id
                            return {
                                ...act,
                                duration: newDuration,
                                endTime: addMinutesToTime(act.startTime, newDuration), // Update the end time
                            };
                        }
                        return act;
                    });
                    return {
                        ...day,
                        schedule: { ...day.schedule, activies: updatedActivities },
                    };
                }
                return day;
            })
        );
    };

    const interval = 15; // 15-minute intervals
    const slotsPerDay = (60 / interval) * 24; // 96 slots for 15-minute intervals
    const occupiedSlots = Array(7).fill(null).map(() => new Array(slotsPerDay).fill(false));

    return (
        <div className='flex flex-col w-full h-full overflow-hidden'>
            <div className='flex'>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='flex flex-col space-y-3 w-[5%] items-center justify-center bg-zinc-50 group hover:cursor-pointer hover:bg-zinc-100'>
                            <RxCountdownTimer />
                            <div className='flex flex-col text-center leading-tight'>
                                <p className='text-[10px] text-gray-400'>Time</p>
                                <p className='text-[10px] text-gray-400'>Range</p>
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Settings Time Range</DialogTitle>
                            <DialogDescription>
                                Choose your best fit time range for daily planning.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="name" className="text-left">
                                    Starting Time
                                </Label>
                                <div className='flex w-full h-20 space-x-2 justify-between items-center text-3xl'>
                                    <div className='flex flex-col h-full w-1/3 leading-tight'>
                                        <Input
                                            id="hour"
                                            defaultValue="0"
                                            type="number"
                                            min="0"
                                            max="12"
                                            className="h-[95%] w-full rounded-md items-center justify-center md:text-3xl text-center"
                                            autoFocus
                                        />
                                        <p className='text-[10px] h-[5%] text-gray-600'>hour</p>
                                    </div>
                                    <span className='text-3xl mb-3'>:</span>
                                    <div className='flex flex-col h-full w-1/3 leading-tight'>
                                        <Input
                                            id="minute"
                                            defaultValue="00"
                                            type="number"
                                            min="0"
                                            max="59"
                                            className="h-[95%] w-full rounded-md items-center justify-center md:text-3xl text-center"
                                            disabled
                                        />
                                        <p className='text-[10px] h-[5%] text-gray-600'>minute</p>
                                    </div>
                                    <div className='flex flex-col h-full w-1/5'>
                                        <div className='flex h-1/2 w-full border bg-indigo-100 rounded-t-lg items-center justify-center'>
                                            <p className='text-zinc-600 text-[12px] font-bold'>AM</p>
                                        </div>
                                        <div className='flex h-1/2 w-full border rounded-b-lg items-center justify-center'>
                                            <p className='text-zinc-600 text-[12px] font-bold'>PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="username" className="text-left">
                                    End Time
                                </Label>
                                <div className='flex w-full h-20 space-x-2 justify-between items-center text-3xl'>
                                    <div className='flex flex-col h-full w-1/3 leading-tight'>
                                        <Input
                                            id="hour"
                                            defaultValue="12"
                                            type="number"
                                            min="0"
                                            max="12"
                                            className="h-[95%] w-full rounded-md items-center justify-center md:text-3xl text-center"
                                            autoFocus
                                        />
                                        <p className='text-[10px] h-[5%] text-gray-600'>hour</p>
                                    </div>
                                    <span className='text-3xl mb-3'>:</span>
                                    <div className='flex flex-col h-full w-1/3 leading-tight'>
                                        <Input
                                            id="minute"
                                            defaultValue="00"
                                            type="number"
                                            min="0"
                                            max="59"
                                            className="h-[95%] w-full rounded-md items-center justify-center md:text-3xl text-center"
                                            disabled
                                        />
                                        <p className='text-[10px] h-[5%] text-gray-600'>minute</p>
                                    </div>
                                    <div className='flex flex-col h-full w-1/5'>
                                        <div className='flex h-1/2 w-full border rounded-t-lg items-center justify-center'>
                                            <p className='text-zinc-600 text-[12px] font-bold'>AM</p>
                                        </div>
                                        <div className='flex h-1/2 w-full border bg-indigo-100 rounded-b-lg items-center justify-center'>
                                            <p className='text-zinc-600 text-[12px] font-bold'>PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <div className='w-[95%] grid grid-cols-7 grid-rows-[auto] gap-0.5 mr-1.5'>
                    {/* Days of the week */}
                    {currentWeek.map((date, index) => (
                        <div key={index} className="flex flex-col justify-between h-20 items-center bg-indigo-50 font-bold text-center text-zinc-500">
                            <div className="flex h-14 flex-col px-2 leading-tight justify-center items-center text-center">
                                <p className="text-[12px]">{date.dayOfWeek}</p>
                                <p>{date.dayOfMonth}</p>
                            </div>
                            <div className="flex h-6 bg-indigo-200 w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex w-full h-full overflow-y-auto custom-scrollbar'>
                <div className="w-[5%] h-full grid grid-rows-[auto_repeat(24,1fr)] gap-[8px] text-center">
                    {/* Hourly slots */}
                    {Array.from({ length: 24 }, (_, hour) => (
                        <div
                            key={hour}
                            className="flex items-center justify-center text-[11px] h-20"
                        >
                            {/* Display the hour in 12-hour AM/PM format */}
                            {hour === 0
                                ? '12 AM'
                                : hour < 12
                                    ? `${hour} AM`
                                    : hour === 12
                                        ? '12 PM'
                                        : `${hour - 12} PM`}
                        </div>
                    ))}
                </div>
                <div className="w-[95%] h-full grid grid-cols-7 grid-rows-[repeat(96,min(0,1fr))] gap-0.5 grid-auto-flow-dense">
                    {Array.from({ length: slotsPerDay }, (_, index) => {
                        const formattedTime = formatTime(index, interval);
                        return (
                            <>
                                {Array.from({ length: 7 }, (_, day) => {
                                    if (occupiedSlots[day][index]) {
                                        return null;
                                    }

                                    // Find the activity that starts at the current formattedTime
                                    const activity = calendarData[day]?.schedule?.activies
                                        .find(activity => activity.startTime === formattedTime);

                                    const shouldSpanRows = activity && activity.duration > 0;

                                    // Dynamically calculate the row span based on activity duration
                                    let spanRows = 1; // Default to 1 row
                                    if (shouldSpanRows) {
                                        spanRows = Math.ceil(activity.duration / interval); // Calculate based on duration and interval
                                    }

                                    // Mark subsequent rows as occupied if this cell spans rows
                                    if (shouldSpanRows) {
                                        for (let offset = 0; offset < spanRows; offset++) {
                                            if (index + offset < slotsPerDay) {
                                                occupiedSlots[day][index + offset] = true;
                                            }
                                        }
                                    }

                                    // Manually calculate the grid row start and end
                                    const gridRowStart = index + 1;
                                    const gridRowEnd = shouldSpanRows ? gridRowStart + spanRows : gridRowStart + 1;
                                    return (
                                        <CalendarCell
                                            key={`${day}-${index}`}
                                            time={formattedTime}
                                            date={currentWeek[day].fullDate}
                                            activity={activity}
                                            onResize={handleResize}
                                            onDrop={(item: Activity) => handleDrop(item, formattedTime, currentWeek[day].fullDate)}
                                            className={shouldSpanRows ? `row-span-${spanRows} h-full rounded-md shadow-md border-none` : 'h-5 text-[10px]'}
                                            style={{
                                                gridRow: `${gridRowStart} / ${gridRowEnd}`,
                                            }}
                                            rowSpan={shouldSpanRows ? spanRows : 1}
                                        />
                                    )
                                })}
                            </>
                        );
                    })}
                </div>
            </div>
        </div >

    );
};

export default CalendarGrid;
