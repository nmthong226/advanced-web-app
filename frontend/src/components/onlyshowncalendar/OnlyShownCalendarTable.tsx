import { useState } from 'react';
import OnlyShownCalendarCell from "./OnlyShownCalendarCell";
import { formatTime, getCurrentWeek } from '@/lib/utils';
import { initialCalendarData } from '@/mocks/MockData';

//Import icons
import { RxCountdownTimer } from "react-icons/rx";

// Define the type for the draggable item.
const OnlyShownCalendarTable = () => {
    // Get current week
    const currentWeek = getCurrentWeek();
    // Use state to track items dropped in specific hours
    const [calendarData] = useState<CalendarData>(initialCalendarData);

    const interval = 15; // 15-minute intervals
    const slotsPerDay = (60 / interval) * 24; // 96 slots for 15-minute intervals
    const occupiedSlots = Array(7).fill(null).map(() => new Array(slotsPerDay).fill(false));

    return (
        <div className='flex flex-col w-full h-full overflow-hidden'>
            <div className='flex'>
                <div className='flex flex-col space-y-3 w-[5%] items-center justify-center bg-zinc-50 group hover:cursor-pointer hover:bg-zinc-100'>
                    <RxCountdownTimer />
                </div>
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
                                        <OnlyShownCalendarCell
                                            key={`${day}-${index}`}
                                            time={formattedTime}
                                            date={currentWeek[day].fullDate}
                                            activity={activity}
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

export default OnlyShownCalendarTable;
