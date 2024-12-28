import { useEffect, useState } from 'react';
import CalendarCell from './CalendarCell';
import {
  addMinutesToTime,
  formatTime,
  getCurrentWeek,
  initialCurrentWeek,
} from '@/lib/utils';

import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

//Import icons
import { RxCountdownTimer } from 'react-icons/rx';

//Import components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import TimeSettings from '../../../../components/settings/TimeSettings';

//Import context
import { useTaskContext } from '@/contexts/UserTaskContext';

//Import types
import { TaskSchedule } from '../../../../types/type';
import { Task } from '../../../table/data/schema';

// Define the type for the draggable item.
const CalendarGrid = ({ date }: { date: string }) => {
  // Get current week
  const currentWeek = getCurrentWeek(date);
  // Calculate the current week based on the date prop
  const [calendarData, setCalendarData] = useState<TaskSchedule[]>([]);
  const { tasks, setTasks } = useTaskContext();

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

  const handleDrop = (item: Task, time: string, date: string) => {
    console.log(`Item dropped at ${time} on ${date}:`, item);

    // Update the task in the context
    updateTaskContext(item._id, { isOnCalendar: true }); // Function to update tasks in the context

    // Add the task to the calendar list
    setCalendarData((prevData) => {
      const updatedData = prevData.map((day) => {
        if (day.date === date) {
          // Ensure no duplicate tasks
          const taskExists = day.tasks.some((task) => task._id === item._id);
          if (taskExists) return day;

          // Create a new task object with calendar-specific updates
          const newItem = {
            ...item,
            id: item._id || uuidv4(),
            startTime: time,
            endTime: addMinutesToTime(time, 30),
            estimatedTime: 30,
            date: date,
            isOnCalendar: true,
          };

          return {
            ...day,
            tasks: [...day.tasks, newItem],
          };
        }
        return day; // If the date doesn't match, return the day unchanged
      });
      return updatedData;
    });
  };

  console.log('123', tasks);

  const updateTaskContext = (taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleResize = (id: string, date: string, newEstimatedTime: number) => {
    // Find the activity in the data and adjust its duration
    setCalendarData((prevData) =>
      prevData.map((day) => {
        if (day.date === date) {
          const updatedTasks = day.tasks.map((task) => {
            if (task._id === id) {
              // Match by id
              return {
                ...task,
                estimatedTime: newEstimatedTime,
                endTime: addMinutesToTime(task.startTime || '', newEstimatedTime), // Update the end time
              };
            }
            return task;
          });
          return {
            ...day,
            tasks: updatedTasks, // Update the activities within the day
          };
        }
        return day;
      }),
    );
  };

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
    <div className="flex flex-col bg-white w-full h-full overflow-hidden">
      <div className="flex">
        <TimeSettings />
        <div className="gap-0.5 grid grid-cols-7 grid-rows-[auto] mr-1.5 w-[95%]">
          {/* Days of the week */}
          {currentWeek.map((date, index) => {
            const today = new Date();
            const isToday = date.dayOfMonth === today.getDate();
            return (
              <div
                key={index}
                className={`${isToday ? ' text-blue-700 bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-100 rounded-xl' : ''}  flex flex-col justify-center items-center bg-indigo-100 rounded-md h-16 font-bold text-center text-zinc-500`}
              >
                <div
                  className={`${isToday ? 'text-white' : ''} flex flex-col justify-center items-center px-2 h-12 w-12 text-center leading-tight`}
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
                    <CalendarCell
                      key={`${day}-${index}`}
                      time={formattedTime}
                      date={currentWeek[day].fullDate}
                      task={task}
                      onResize={handleResize}
                      onDrop={(item: Task) =>
                        handleDrop(
                          item,
                          formattedTime,
                          currentWeek[day].fullDate,
                        )
                      }
                      className={`${task ? `row-span-${spanRows} col-span-1 w-full h-full shadow-md border-r` : 'col-span-1 row-span-1 h-5 text-[10px] border-r'} ${isBorderRow && !task ? 'border-b border-gray-300' : ''}`}
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