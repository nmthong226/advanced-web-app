import { useEffect, useState } from 'react';
import {
  formatTime,
  getCurrentWeek,
  initialCurrentWeek,
} from '@/lib/utils';

//Import icons

//Import components
import TimeSettings from '../../settings/TimeSettings';

//Import context
import { useTaskContext } from '@/contexts/UserTaskContext';

//Import types
import { TaskSchedule } from '../../../types/type';
import OnlyShownCalendarCell from './OnlyShownWeekCell';

// Define the type for the draggable item.
const CalendarGrid = ({ date }: { date: string }) => {
  // Get current week
  const currentWeek = getCurrentWeek(date);  
  // Calculate the current week based on the date prop
  const [calendarData, setCalendarData] = useState<TaskSchedule[]>([]);
  const { tasks } = useTaskContext();

  useEffect(() => {
    const currentWeek = initialCurrentWeek(date);
    const currentWeekDates = currentWeek.map((day) => day.date);

    // Dynamically initialize the initial calendar data with all days of the week
    const initialTaskData = currentWeek.map((day) => ({
      date: day.date,
      dayOfWeek: day.dayOfWeek,
      userId: '', // Assuming a default user for simplicity
      tasks: [], // Empty task list initially
    }));

    const filteredData = tasks.reduce((acc: TaskSchedule[], task) => {
      if (!task.dueTime) return acc; // Ignore tasks without due time

      // Format dueTime as "dd-mm-yyyy"
      const formattedDueTime = new Date(task.dueTime).toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      );
      // Get the day of the week (e.g., 'Mon', 'Tue', 'Wed', etc.)
      const dayOfWeek = new Date(task.dueTime).toLocaleDateString('en-GB', {
        weekday: 'short',
      });

      // Check if the formatted dueTime matches any of the current week's dates
      if (currentWeekDates.includes(formattedDueTime)) {
        const existingGroup = acc.find(
          (group) => group.date === formattedDueTime,
        );

        if (existingGroup) {
          existingGroup.tasks.push(task); // Group the task
        } else {
          acc.push({
            date: formattedDueTime,
            dayOfWeek,
            userId: task.userId,
            tasks: [task],
          });
        }
      }
      return acc;
    }, initialTaskData); // Use the dynamically initialized task data

    setCalendarData(filteredData);
  }, [date]); // Dependency array ensures this runs whenever date changes
  console.log(calendarData);

  const interval = 15; // 15-minute intervals
  const startHour = 6; // Start from 6 AM
  const endHour = 24; // End at 12 PM
  const slotsPerDay = (endHour + 1 - startHour) * (60 / interval); // Number of slots between 6 AM and 12 PM
  const occupiedSlots = Array(7)
    .fill(null)
    .map(() => new Array(slotsPerDay).fill(false));

  if (!calendarData) {
    return <div>Loading...</div>; // Or any custom loading component
  }

  return (
    <div className="flex flex-col bg-white dark:bg-slate-700 w-full h-full overflow-hidden">
      <div className="flex justify-end">
        <TimeSettings />
        <div className="gap-[1px] grid grid-cols-7 grid-rows-[auto] mr-1.5 w-[95%]">
          {/* Days of the week */}
          {currentWeek.map((date, index) => {
            const today = new Date();
            const isToday = date.dayOfMonth === today.getDate();
            return (
              <div
                key={index}
                className={`${isToday ? ' text-blue-700 bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-100 rounded-xl' : ''}  flex flex-col justify-center items-center dark:bg-indigo-800 bg-indigo-100 rounded-xl rounded-b-none h-16 font-bold text-center text-zinc-500`}
              >
                <div
                  className={`${isToday ? 'text-white dark:text-black' : 'dark:text-gray-300'} flex flex-col justify-center items-center px-2 h-12 w-12 text-center leading-tight`}
                >
                  <p className="text-[12px]">{date.dayOfWeek}</p>
                  <p>{date.dayOfMonth}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex custom-scrollbar w-full h-full overflow-x-hidden overflow-y-auto">
        <div className="grid grid-rows-[auto_repeat(24,1fr)] w-[5%] h-full text-center">
          {/* Hourly slots (6 AM to 12 PM, then 1 PM to 12 PM) */}
          {Array.from({ length: 19 }, (_, index) => {
            const hour = index < 7 ? 6 + index : index - 6; // Generate 6 AM to 12 PM and 1 PM to 12 PM
            const period = index < 7 ? 'AM' : 'PM'; // Determine AM or PM
            return (
              <div
                key={index}
                className="flex justify-center items-start h-20 text-[11px]"
              >
                {/* Display the hour in 12-hour AM/PM format */}
                {hour === 0 ? '12 AM' : hour} {period}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 grid-rows-[repeat(96,20px)] grid-flow-row-dense w-[95%] h-full">
          {Array.from({ length: slotsPerDay }, (_, index) => {
            const formattedTime = formatTime(
              startHour * (60 / interval) + index,
              interval,
            );
            return (
              <>
                {Array.from({ length: 7 }, (_, day) => {
                  if (occupiedSlots[day][index]) {
                    return null;
                  }
                  const task = calendarData[day]?.tasks.find(
                    (task) => {
                      return (task.startTime || '') === formattedTime;
                    },
                  );

                  const shouldSpanRows = task && task.estimatedTime && task.estimatedTime > 0;

                  let spanRows = 1; // Default to 1 row
                  if (shouldSpanRows) {
                    spanRows = Math.ceil((task.estimatedTime || 0) / interval);
                  }

                  if (shouldSpanRows) {
                    for (let offset = 0; offset < spanRows; offset++) {
                      if (index + offset < slotsPerDay) {
                        occupiedSlots[day][index + offset] = true;
                      }
                    }
                  }

                  const gridRowStart = index + 1;
                  const gridRowEnd = shouldSpanRows
                    ? gridRowStart + spanRows
                    : gridRowStart + 1;

                  // Apply border to every 4th row
                  const isBorderRow = (index + 1) % 4 === 0;

                  return (
                    <OnlyShownCalendarCell
                      key={`${day}-${index}`}
                      time={formattedTime}
                      date={currentWeek[day].fullDate}
                      task={task}
                      className={`${task ? `row-span-${spanRows} col-span-1 w-full h-full shadow-md border-r dark:border-r-gray-500` : 'col-span-1 row-span-1 h-5 text-[10px] border-r dark:border-r-gray-500'} ${isBorderRow && !task ? 'border-b border-gray-300 dark:border-r-gray-500' : ''}`}
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
    </div>
  );
};

export default CalendarGrid;
