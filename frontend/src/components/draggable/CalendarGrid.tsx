import { useState } from 'react';
import CalendarCell from "./CalendarCell";
import { formatTime, getCurrentWeek } from '@/lib/utils';
import { initialCalendarData } from '@/mocks/mockCalendar';

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
                    const updatedActivities = [...day.schedule.activies, item];
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


    const interval = 15; // 15-minute intervals
    const slotsPerDay = (60 / interval) * 24; // 96 slots for 15-minute intervals
    console.log("calendar", calendarData);

    const occupiedSlots = Array(7).fill(null).map(() => new Array(slotsPerDay).fill(false));

    return (
        <div className="w-[95%] h-full grid grid-cols-7 grid-rows-[repeat(96,min(0,1fr))] gap-0.5 grid-auto-flow-dense">
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
            {Array.from({ length: slotsPerDay }, (_, index) => {
                const formattedTime = formatTime(index, interval);
                return (
                    <>
                        {Array.from({ length: 7 }, (_, day) => {
                            if (occupiedSlots[day][index]) {
                                return null;
                            }
                            // Check if the activity should span 2 rows
                            const activity = calendarData[day]?.schedule?.activies
                                .find(activity => activity.startTime === formattedTime);

                            const shouldSpanRows = activity && activity.duration === 60;
                            // Mark subsequent rows as occupied if this cell spans rows
                            if (shouldSpanRows) {
                                for (let offset = 0; offset < 4; offset++) {
                                    if (index + offset < slotsPerDay) {
                                        occupiedSlots[day][index + offset] = true;
                                    }
                                }
                            }
                            // Manually calculate the row span using style if needed
                            const gridRowStart = index + 1;
                            const gridRowEnd = shouldSpanRows ? gridRowStart + 4 : gridRowStart + 1;
                            return (
                                <CalendarCell
                                    key={`${day}-${index}`}
                                    time={formattedTime}
                                    date={currentWeek[day].fullDate}
                                    color={calendarData[day]?.schedule?.activies
                                        .find(activity => activity.startTime === formattedTime)?.color || ''}
                                    activity={calendarData[day]?.schedule?.activies
                                        .find(activity => activity.startTime === formattedTime)?.title || []}
                                    onDrop={(item: Activity) => handleDrop(item, formattedTime, currentWeek[day].fullDate)}
                                    className={shouldSpanRows ? 'row-span-4 h-full' : 'h-5'}
                                    style={{
                                        gridRow: `${gridRowStart} / ${gridRowEnd}`,
                                    }}
                                />
                            )
                        })}
                    </>
                );
            })}
        </div>
    );
};

export default CalendarGrid;
