import { useEffect, useState } from 'react';
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
const CalendarGrid = ({ date }: { date: string }) => {
    // Get current week
    const currentWeek = getCurrentWeek(date);
    // Calculate the current week based on the date prop
    const [calendarData, setCalendarData] = useState<CalendarData>([]);

    useEffect(() => {
        // Calculate the current week whenever `date` changes
        const currentWeek = getCurrentWeek(date);
        const currentWeekDates = currentWeek.map((day) => day.fullDate);

        // Filter the initial calendar data to include only the current week
        const filteredData = initialCalendarData.filter((data) =>
            currentWeekDates.includes(data.date)
        );

        setCalendarData(filteredData);
    }, [date]); // Dependency array ensures this runs whenever `date` changes

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
                    const updatedActivities = [...day.schedule.activities, newItem];
                    return {
                        ...day,
                        schedule: {
                            ...day.schedule,
                            activities: updatedActivities,
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
                    const updatedActivities = day.schedule.activities.map((act) => {
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
                        schedule: { ...day.schedule, activities: updatedActivities },
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
                        <div className='flex flex-col justify-center items-center space-y-3 bg-zinc-50 hover:bg-zinc-100 w-[5%] hover:cursor-pointer group'>
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
                                <div className='flex justify-between items-center space-x-2 w-full h-20 text-3xl'>
                                    <div className='flex flex-col w-1/3 h-full leading-tight'>
                                        <Input
                                            id="hour"
                                            defaultValue="0"
                                            type="number"
                                            min="0"
                                            max="12"
                                            className="justify-center items-center rounded-md w-full h-[95%] text-center md:text-3xl"
                                            autoFocus
                                        />
                                        <p className='h-[5%] text-[10px] text-gray-600'>hour</p>
                                    </div>
                                    <span className='mb-3 text-3xl'>:</span>
                                    <div className='flex flex-col w-1/3 h-full leading-tight'>
                                        <Input
                                            id="minute"
                                            defaultValue="00"
                                            type="number"
                                            min="0"
                                            max="59"
                                            className="justify-center items-center rounded-md w-full h-[95%] text-center md:text-3xl"
                                            disabled
                                        />
                                        <p className='h-[5%] text-[10px] text-gray-600'>minute</p>
                                    </div>
                                    <div className='flex flex-col w-1/5 h-full'>
                                        <div className='flex justify-center items-center bg-indigo-100 border rounded-t-lg w-full h-1/2'>
                                            <p className='font-bold text-[12px] text-zinc-600'>AM</p>
                                        </div>
                                        <div className='flex justify-center items-center border rounded-b-lg w-full h-1/2'>
                                            <p className='font-bold text-[12px] text-zinc-600'>PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="username" className="text-left">
                                    End Time
                                </Label>
                                <div className='flex justify-between items-center space-x-2 w-full h-20 text-3xl'>
                                    <div className='flex flex-col w-1/3 h-full leading-tight'>
                                        <Input
                                            id="hour"
                                            defaultValue="12"
                                            type="number"
                                            min="0"
                                            max="12"
                                            className="justify-center items-center rounded-md w-full h-[95%] text-center md:text-3xl"
                                            autoFocus
                                        />
                                        <p className='h-[5%] text-[10px] text-gray-600'>hour</p>
                                    </div>
                                    <span className='mb-3 text-3xl'>:</span>
                                    <div className='flex flex-col w-1/3 h-full leading-tight'>
                                        <Input
                                            id="minute"
                                            defaultValue="00"
                                            type="number"
                                            min="0"
                                            max="59"
                                            className="justify-center items-center rounded-md w-full h-[95%] text-center md:text-3xl"
                                            disabled
                                        />
                                        <p className='h-[5%] text-[10px] text-gray-600'>minute</p>
                                    </div>
                                    <div className='flex flex-col w-1/5 h-full'>
                                        <div className='flex justify-center items-center border rounded-t-lg w-full h-1/2'>
                                            <p className='font-bold text-[12px] text-zinc-600'>AM</p>
                                        </div>
                                        <div className='flex justify-center items-center bg-indigo-100 border rounded-b-lg w-full h-1/2'>
                                            <p className='font-bold text-[12px] text-zinc-600'>PM</p>
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
                <div className='gap-0.5 grid grid-cols-7 grid-rows-[auto] mr-1.5 w-[95%]'>
                    {/* Days of the week */}
                    {currentWeek.map((date, index) => (
                        <div key={index} className="flex flex-col justify-between items-center bg-indigo-50 h-20 font-bold text-center text-zinc-500">
                            <div className="flex flex-col justify-center items-center px-2 h-14 text-center leading-tight">
                                <p className="text-[12px]">{date.dayOfWeek}</p>
                                <p>{date.dayOfMonth}</p>
                            </div>
                            <div className="flex bg-indigo-200 w-full h-6"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex custom-scrollbar w-full h-full overflow-x-hidden overflow-y-auto'>
                <div className="gap-[8px] grid grid-rows-[auto_repeat(24,1fr)] w-[5%] h-full text-center">
                    {/* Hourly slots */}
                    {Array.from({ length: 24 }, (_, hour) => (
                        <div
                            key={hour}
                            className="flex justify-center items-center h-20 text-[11px]"
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
                <div className="gap-0.5 grid grid-cols-7 grid-rows-[repeat(96,20px)] grid-flow-row-dense w-[95%] h-full">
                    {Array.from({ length: slotsPerDay }, (_, index) => {
                        const formattedTime = formatTime(index, interval);
                        return (
                            <>
                                {Array.from({ length: 7 }, (_, day) => {
                                    if (occupiedSlots[day][index]) {
                                        return null;
                                    }

                                    // Find the activity that starts at the current formattedTime
                                    const activity = calendarData[day]?.schedule?.activities
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
                                            className={shouldSpanRows ? `row-span-${spanRows} col-span-1 h-full rounded-md shadow-md border-none` : 'col-span-1 row-span-1 h-5 text-[10px]'}
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
