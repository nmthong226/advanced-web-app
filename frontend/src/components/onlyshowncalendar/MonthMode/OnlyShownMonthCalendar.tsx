import { useEffect, useState } from "react";
import { OnlyShownMonthCell } from "./OnlyShownMonthCell";

type MonthCalendarProps = {
    month: number; // 0-based index (0 = January, 11 = December)
    year: number;
};

const OnlyShownMonthCalendar: React.FC<MonthCalendarProps> = ({ month, year }) => {
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);

    useEffect(() => {
        const generateCalendarDays = () => {
            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);

            const firstDayIndex = firstDayOfMonth.getDay();
            const totalDaysInMonth = lastDayOfMonth.getDate();

            const days: Date[] = [];

            // Add padding days for the previous month
            for (let i = 0; i < firstDayIndex; i++) {
                const prevDate = new Date(year, month, -i);
                days.unshift(prevDate);
            }

            // Add all days of the current month
            for (let i = 1; i <= totalDaysInMonth; i++) {
                days.push(new Date(year, month, i));
            }

            // Add padding days for the next month
            const lastDayIndex = lastDayOfMonth.getDay();
            for (let i = 1; i < 7 - lastDayIndex; i++) {
                days.push(new Date(year, month + 1, i));
            }

            setCalendarDays(days);
        };

        generateCalendarDays();
    }, [month, year]);

    const formatFullDate = (date: Date) => {
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    };

    return (
        <div className="flex flex-col bg-white dark:bg-slate-700 px-1 w-full h-full overflow-hidden">
            <div className="gap-0.5 grid grid-cols-7 w-full">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <div
                        key={index}
                        className={`flex flex-col justify-center items-center bg-indigo-100 dark:bg-indigo-800 dark:text-gray-300 rounded-md h-16 font-bold text-center text-zinc-500`}
                    >
                        <div
                            className={`flex flex-col justify-center items-center px-2 h-12 w-12 text-center leading-tight`}
                        >
                            <p className="text-[12px]">{day}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex custom-scrollbar pb-2 w-full h-full overflow-x-hidden overflow-y-auto">
                <div className="grid grid-cols-7 w-full h-full">
                    {calendarDays.map((day, index) => {
                        const today = new Date();
                        const isToday =
                            day.getDate() === today.getDate() &&
                            day.getMonth() === today.getMonth() &&
                            day.getFullYear() === today.getFullYear();

                        // Check if the cell is in the last row
                        const isLastRow = Math.floor(index / 7) === Math.floor((calendarDays.length - 1) / 7);
                        return (
                            <OnlyShownMonthCell
                                key={index}
                                day={day}
                                month={month}
                                index={index}
                                isToday={isToday}
                                formatFullDate={formatFullDate}
                                className={`h-full ${isLastRow && index % 7 === 0 ? "rounded-l-sm" : ""
                                    } ${isLastRow && index % 7 === 6 ? "rounded-r-sm" : ""
                                    }`}
                            >
                                
                            </OnlyShownMonthCell>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OnlyShownMonthCalendar;