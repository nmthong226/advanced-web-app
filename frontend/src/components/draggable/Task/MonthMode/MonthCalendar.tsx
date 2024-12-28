import { useState, useEffect } from 'react';
import TimeSettings from '../../../../components/settings/TimeSettings';

const MonthCalendar = () => {
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);

    useEffect(() => {
        const generateCalendarDays = () => {
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth();

            const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
            const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

            const firstDayIndex = firstDayOfMonth.getDay(); // Day of the week for the first date
            const totalDaysInMonth = lastDayOfMonth.getDate();

            const days: Date[] = [];

            // Add padding days for the previous month
            for (let i = 0; i < firstDayIndex; i++) {
                const prevDate = new Date(currentYear, currentMonth, -i);
                days.unshift(prevDate);
            }

            // Add all days of the current month
            for (let i = 1; i <= totalDaysInMonth; i++) {
                days.push(new Date(currentYear, currentMonth, i));
            }

            // Add padding days for the next month
            const lastDayIndex = lastDayOfMonth.getDay();
            for (let i = 1; i < 7 - lastDayIndex; i++) {
                days.push(new Date(currentYear, currentMonth + 1, i));
            }

            setCalendarDays(days);
        };

        generateCalendarDays();
    }, []);

    return (
        <div className="flex flex-col bg-white px-4 w-full h-full overflow-hidden">
            <div className="gap-0.5 grid grid-cols-7 w-full">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div
                        key={index}
                        className={`flex flex-col justify-center items-center bg-indigo-100 rounded-md h-16 font-bold text-center text-zinc-500`}
                    >
                        <div
                            className={`flex flex-col justify-center items-center px-2 h-12 w-12 text-center leading-tight`}
                        >
                            <p className="text-[12px]">{day}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`flex flex-col border border-t-0 border-r-0 h-[116px] ${day.getMonth() === new Date().getMonth()
                            ? 'bg-white' // Highlight current month's days
                            : 'bg-gray-50'
                            }`}
                    >
                        <p className="pt-0.5 pl-0.5 font-semibold text-[12px] text-gray-700">
                            {day.getDate()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthCalendar;
