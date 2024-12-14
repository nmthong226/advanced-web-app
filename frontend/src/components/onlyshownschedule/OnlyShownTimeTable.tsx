import { forwardRef, useEffect, useRef, useState } from 'react';
import OnlyShownCalendarCell from "./OnlyShownTimeTableCell";
import { cn, formatTime, getCurrentWeek } from '@/lib/utils';
import { initialActivityData } from '@/mocks/MockData';

//Import icons
import { CiClock1 } from "react-icons/ci";

type Props = {
    className: string,
    tableClassName: string,
}

// Define the type for the draggable item.
const OnlyShownTimeTable = forwardRef<HTMLDivElement, Props>(({ className, tableClassName }, ref) => {
    // Get current week
    const currentWeek = getCurrentWeek();
    // Use state to track items dropped in specific hours
    const [calendarData] = useState<ActivitySchedule[]>(initialActivityData);

    const interval = 15; // 15-minute intervals
    const startHour = 6; // Start from 6 AM
    const endHour = 24; // End at 12 PM
    const totalMinutes = (endHour - startHour) * 60; // Total minutes in the timetable
    const slotsPerDay = (endHour + 1 - startHour) * (60 / interval); // Number of slots between 6 AM and 12 PM
    const occupiedSlots = Array(7).fill(null).map(() => new Array(slotsPerDay).fill(false));

    const [indicatorPosition, setIndicatorPosition] = useState(0);
    const [isIndicatorVisible, setIsIndicatorVisible] = useState(true); // Track visibility
    const timetableRef = useRef<HTMLDivElement>(null);
    const [formattedTime, setFormattedTime] = useState(''); // State for the current time display

    const updateTimeIndicatorPosition = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        // Format the time to HH:MM AM/PM
        const formattedHour = currentHour % 12 || 12; // Convert 24-hour to 12-hour format
        const period = currentHour < 12 ? 'AM' : 'PM';
        const formattedMinutes = currentMinutes.toString().padStart(2, '0');
        setFormattedTime(`${formattedHour}:${formattedMinutes} ${period}`);

        // Check if the time is outside the timetable range
        if (currentHour < startHour && currentHour >= 0) {
            setIsIndicatorVisible(false); // Hide the indicator between 12 AM and 6 AM
            return;
        }

        // Show the indicator otherwise
        setIsIndicatorVisible(true);

        // Calculate total minutes elapsed since startHour
        const elapsedMinutes = (currentHour - startHour) * 60 + currentMinutes;

        // Get the timetable height
        const timetableHeight = timetableRef.current?.scrollHeight || 0;

        // Calculate position in pixels
        const position = (elapsedMinutes / totalMinutes) * timetableHeight - 70;
        setIndicatorPosition(position);
    };

    useEffect(() => {
        updateTimeIndicatorPosition(); // Initial calculation
        const intervalId = setInterval(updateTimeIndicatorPosition, 60000); // Update every minute
        return () => clearInterval(intervalId);
    }, []);

    // Inside the return statement of OnlyShownTimeTable component
    return (
        <div
            ref={ref}
            className={cn(`relative flex flex-col w-full h-full overflow-hidden group`, className)}>
            <div className='flex'>
                <div
                    className='flex flex-col justify-center items-center space-y-3 bg-zinc-50 hover:bg-zinc-100 w-[5%] hover:cursor-pointer group'
                    onClick={() => setIsIndicatorVisible(!isIndicatorVisible)}
                >
                    <CiClock1 />
                    <div className='flex flex-col text-center leading-tight'>
                        <p className='text-[10px] text-gray-400'>Show</p>
                        <p className='text-[10px] text-gray-400'>Time</p>
                    </div>
                </div>
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
            <div className='relative flex custom-scrollbar w-full h-full overflow-y-auto' ref={timetableRef}>
                {isIndicatorVisible && (
                    <div className="z-50 absolute flex items-center w-full" style={{ top: `${indicatorPosition}px` }}>
                        <div className='flex justify-center items-center bg-gradient-to-r from-red-600 to-amber-400 border border-red-indigo-300 border-b rounded-md w-[55px]'>
                            <p className='font-semibold text-[10px] text-white'>{formattedTime}</p>
                        </div>
                        <hr
                            className="border-0 border-t-2 border-red-600 border-dotted w-full h-[4px]"
                            style={{ borderSpacing: '10px' }}
                        />
                    </div>
                )}
                <div className="gap-[8px] grid grid-rows-[auto_repeat(19,1fr)] w-[5%] h-full text-center">
                    {Array.from({ length: 19 }, (_, index) => {
                        const hour = index < 7 ? 6 + index : index - 6; // Generate 6 AM to 12 PM and 1 PM to 12 PM
                        const period = index < 7 ? 'AM' : 'PM'; // Determine AM or PM
                        const now = new Date();
                        const currentHour = now.getHours();

                        // Match 24-hour current hour to the 12-hour slot system
                        const isCurrentHour = (() => {
                            const isAM = currentHour < 12;
                            const twelveHourFormat = currentHour % 12 || 12; // 12-hour format
                            return hour === twelveHourFormat && period === (isAM ? 'AM' : 'PM');
                        })();

                        return (
                            <div
                                key={index}
                                className={`flex justify-center items-center h-20 text-[11px] ${isIndicatorVisible && isCurrentHour ? 'invisible' : 'visible'
                                    }`}
                            >
                                {hour === 0 ? '12 AM' : hour} {period}
                            </div>
                        );
                    })}
                </div>
                <div className="gap-0.5 grid grid-cols-7 grid-rows-[repeat(24,1fr)] grid-auto-flow-dense w-[95%] h-full">
                    {Array.from({ length: slotsPerDay }, (_, index) => {
                        const formattedTime = formatTime(startHour * (60 / interval) + index, interval);
                        return (
                            <>
                                {Array.from({ length: 7 }, (_, day) => {
                                    if (occupiedSlots[day][index]) {
                                        return null;
                                    }

                                    const activity = calendarData[day]?.activities
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
                                                    ? `row-span-${spanRows} w-[96%] h-full rounded-md shadow-md border-none`
                                                    : cn(`col-span-1 row-span-1 h-5 text-[10px]`, tableClassName)
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
});

export default OnlyShownTimeTable;
