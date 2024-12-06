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
    const startHour = 6; // Start from 6 AM
    const endHour = 24; // End at 12 PM
    const slotsPerDay = (endHour + 1 - startHour) * (60 / interval); // Number of slots between 6 AM and 12 PM
    const occupiedSlots = Array(7).fill(null).map(() => new Array(slotsPerDay).fill(false));

    return (
        <div className='flex flex-col w-full h-full overflow-hidden relative group'>
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
                <div className="w-[5%] h-full grid grid-rows-[auto_repeat(19,1fr)] gap-[8px] text-center">
                    {/* Hourly slots (6 AM to 12 PM, then 1 PM to 12 PM) */}
                    {Array.from({ length: 19 }, (_, index) => {
                        const hour = index < 7 ? 6 + index : index - 6; // Generate 6 AM to 12 PM and 1 PM to 12 PM
                        const period = index < 7 ? 'AM' : 'PM'; // Determine AM or PM
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-center text-[11px] h-20"
                            >
                                {/* Display the hour in 12-hour AM/PM format */}
                                {hour === 0 ? '12 AM' : hour} {period}
                            </div>
                        );
                    })}
                </div>
                <div className="w-[95%] h-full grid grid-cols-7 grid-rows-[repeat(24,1fr)] gap-0.5 grid-auto-flow-dense">
                    {Array.from({ length: slotsPerDay }, (_, index) => {
                        const formattedTime = formatTime(startHour * (60 / interval) + index, interval);
                        return (
                            <>
                                {Array.from({ length: 7 }, (_, day) => {
                                    if (occupiedSlots[day][index]) {
                                        return null;
                                    }

                                    const activity = calendarData[day]?.schedule?.activies
                                        .find(activity => activity.startTime === formattedTime);

                                    const shouldSpanRows = activity && activity.duration > 0;

                                    let spanRows = 1;
                                    if (shouldSpanRows) {
                                        spanRows = Math.ceil(activity.duration / interval);
                                    }

                                    if (shouldSpanRows) {
                                        for (let offset = 0; offset < spanRows; offset++) {
                                            if (index + offset < slotsPerDay) {
                                                occupiedSlots[day][index + offset] = true;
                                            }
                                        }
                                    }

                                    const gridRowStart = index + 1;
                                    const gridRowEnd = shouldSpanRows ? gridRowStart + spanRows : gridRowStart + 1;

                                    return (
                                        <OnlyShownCalendarCell
                                            key={`${day}-${index}`}
                                            time={formattedTime}
                                            date={currentWeek[day].fullDate}
                                            activity={activity}
                                            className={
                                                shouldSpanRows
                                                    ? `row-span-${spanRows} h-full rounded-md shadow-md border-none`
                                                    : 'h-5 text-[10px]'
                                            }
                                            style={{
                                                gridRow: `${gridRowStart} / ${gridRowEnd}`,
                                            }}
                                            rowSpan={shouldSpanRows ? spanRows : 1}
                                        />
                                    );
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
