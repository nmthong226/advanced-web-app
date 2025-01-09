//Import frameworks
import { useCallback, useEffect, useMemo, useState } from 'react';

//Import libs/packages
import dayjs from 'dayjs';
import moment from 'moment';
import {
  Calendar,
  momentLocalizer,
  Views,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

//Import components
import Chart from '../../components/charts/BarChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import ChatAI from '../../components/AI/chatHistory';

//Import icons
import { BsCheck, BsListTask } from "react-icons/bs";
import { GiTomato } from "react-icons/gi";
import { FaCheck } from "react-icons/fa6";
import { RiRestTimeLine } from "react-icons/ri";

//Import contexts
import { useSettings } from '../../contexts/SettingsContext';
import { useUser } from '@clerk/clerk-react';
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';

import CustomEvent from "../Calendar/Event.tsx";
import { formatDate } from "date-fns";
import { GoArrowDown, GoArrowRight, GoArrowUp } from "react-icons/go";
import { Event, TaskItem } from "../../types/type.js";
import { convertTasksToEvents } from "@/lib/utils.ts";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop<Event>(Calendar);

//Import styles
import './style.css';
import { useTasksContext } from '../../components/table/context/task-context.tsx';
import { toast } from 'react-toastify';
import { FaUndoAlt } from 'react-icons/fa';
import axios from 'axios';
import EventCalendar from '../Calendar/EventCalendar.tsx';

const Home = () => {
  const { user } = useUser();
  const { settings, showLeftBar } = useSettings();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMorning, setIsMorning] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>('Good Morning');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const defaultDate = useMemo(() => new Date(), [])
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<Event | null>(null);
  const [, setPendingDeletes] = useState<Map<string, NodeJS.Timeout>>(
    new Map(),
  );
  const { setOpen, handleOpen } = useTasksContext();

  const { tasks, setTasks } = useTaskContext(); // Access tasks from context

  const [, setSelectedEvent] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });


  useEffect(() => {
    const events = convertTasksToEvents(tasks);
    setMyEvents(events);
  }, [tasks, setTasks]);

  // Function to update the current time
  const updateTime = () => {
    const now = dayjs(); // Use dayjs for better formatting
    const formattedTime = now.format('hh:mm A, DD MMM YYYY'); // Format as 12-hour time with AM/PM, date and year
    setCurrentTime(formattedTime);

    // Determine if it's morning or night based on the hour
    const hour = now.hour();
    setIsMorning(hour < 12); // Morning is before 12 PM

    // Set the greeting based on the time of day
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    updateTime(); // Initial call to set the time immediately
    return () => clearInterval(timer); // Clear the interval when the component is unmounted
  }, []);

  useEffect(() => {
    const events = convertTasksToEvents(tasks);
    setMyEvents(events);
  }, [tasks, setTasks]);

  const eventPropGetter = (event: Event) => {
    const isSelected = event._id === selectedCalendarEvent?._id;

    // Define category-based colors
    const categoryColors: { [key: string]: string } = {
      work: "#CDC1FF", // Blue
      leisure: "#96E9C6", // Green
      personal: "#FDE767", // Yellow
      urgent: "#FF8F8F", // Red
      default: "#EEF2FF", // Default color
    };

    // Get the background color based on category or fallback to default
    const backgroundColor =
      categoryColors[event?.category?.toLowerCase() as keyof typeof categoryColors] || categoryColors.default;

    return {
      className: "shadow-lg text-xs",
      style: {
        backgroundColor: isSelected ? "#ccc" : backgroundColor, // Gray for selected, category color for others
        color: isSelected ? "#555" : "black", // Adjust text color if needed
        border: "1px solid #A7BBC7",
        opacity: event.status === "completed" || event.status === "expired" ? 0.5 : 1,
        textDecoration: event.status === "completed" || event.status === "expired" ? "line-through" : "none",
      },
    };
  };

  console.log("myEvents:", myEvents);

  const handleSelectEvent = (event: Event) => {
    setSelectedCalendarEvent(event); // Set the selected event data
    setDialogOpen(true); // Open the dialog
  };


  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const { start, end } = slotInfo;
    setSelectedEvent({ start, end });
    handleOpen("create");
  }

  const undoDelete = useCallback((task: TaskItem) => {
    setPendingDeletes((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(task._id as string)) {
        clearTimeout(newMap.get(task._id as string) as NodeJS.Timeout);
        newMap.delete(task._id as string);
      }
      return newMap;
    });
    setTasks((prevTasks) => [...prevTasks, task]);
    toast.success(
      <p className='text-sm'>Task restored successfully!</p>
    );
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedCalendarEvent) return;

    const taskId = selectedCalendarEvent._id as string;
    const taskToDelete = selectedCalendarEvent;

    // Temporarily remove the task from the list
    setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));

    // Track if the delete was undone
    let isUndone = false;

    // Show toast with undo option
    const toastId = toast.error(
      <div className='flex items-center space-x-2 text-sm'>
        <p>Task deleted.{' '}</p>
        <button
          onClick={() => {
            undoDelete(taskToDelete); // Restore the task
            isUndone = true; // Mark as undone
            toast.dismiss(toastId); // Close the toast immediately
          }}
          className='flex items-center border-white px-2 py-0.5 border rounded-md font-semibold text-indigo-100'
        >
          <FaUndoAlt className='mr-1 size-3' />
          Undo
        </button>
      </div>,
      {
        autoClose: 4000, // Automatically close after 4 seconds
        closeOnClick: false, // Prevent toast from closing on accidental clicks
        onClose: () => {
          if (!isUndone) {
            // Permanently delete if not undone
            const timeoutId = setTimeout(async () => {
              try {
                await axios.delete(`${import.meta.env.VITE_BACKEND}/tasks/${taskId}`);
              } catch (error) {
                console.error('Error deleting task:', error);
                setTasks((prevTasks) => [...prevTasks, taskToDelete]);
              }
              setPendingDeletes((prev) => {
                const newMap = new Map(prev);
                newMap.delete(taskId);
                return newMap;
              });
            }, 0); // Start delete operation immediately
            setPendingDeletes((prev) => {
              const newMap = new Map(prev);
              newMap.set(taskId, timeoutId);
              return newMap;
            });
          }
        },
      },
    );

    setSelectedCalendarEvent(null);
    setOpen(null);
  }, [selectedCalendarEvent, setTasks, setOpen, setPendingDeletes]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setSelectedCalendarEvent(null); // Clear the selected event
    }, 100);
  };

  const [scrollToTime] = useState(
    new Date(1970, 1, 1, new Date().getHours(), 0, 0) // Default to this hour
  );

  return (
    <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-slate-800 p-2 w-full h-full overflow-y-hidden">
      {showLeftBar && (
        <div className="flex flex-col space-y-4 w-[25%] h-full">
          {/*Show greetings*/}
          {settings.showGreetings && (
            <div className="flex flex-col bg-white dark:bg-slate-600 shadow-md p-1 rounded-lg w-full h-[10%]">
              <div
                className={`flex flex-col w-full h-full border rounded-lg items-start justify-center pl-4 
          ${isMorning ? 'bg-gradient-to-b from-sky-400 to-indigo-100 dark:to-indigo-800' : 'bg-gradient-to-b from-purple-400 to-indigo-100 dark:to-indigo-800'}`}
              >
                <p className="font-base text-[13px] text-zinc-500 dark:text-gray-100">
                  {currentTime}
                </p>
                <p className="line-clamp-1 font-semibold text-sm text-zinc-700 md:text-base lg:text-lg dark:text-white">
                  {greeting}, {user?.fullName}!
                </p>
              </div>
            </div>
          )}
          {/*Upcoming task or activity*/}
          {settings.showUpcoming && (
            <div className="flex flex-col bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg w-full h-[15%]">
              <div className="flex flex-col justify-start w-full">
                <div className="flex justify-between items-center border-b">
                  <p className="m-2 font-semibold text-sm">Your Upcoming</p>
                  <div className="flex space-x-1 text-[12px]">
                    <button className="px-1.5 border rounded-sm w-14">
                      Activity
                    </button>
                    <button className="px-1.5 border rounded-sm w-14">
                      Task
                    </button>
                  </div>
                </div>
                <div className="flex justify-center items-center w-full h-[50px] text-[12px]">You have no upcoming activity.</div>
              </div>
            </div>
          )}
          {/*Task Overview*/}
          {settings.showTaskOverview && (
            <div className="flex flex-col justify-between bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg w-full h-[40%]">
              <div className="flex flex-col w-full h-[85%]">
                <div className="flex justify-between items-center border-b">
                  <p className="m-2 font-semibold text-sm">Task Overview</p>
                  <div className="flex space-x-1">
                    <div className="bg-indigo-400 rounded-full w-2 h-2 hover:cursor-pointer" />
                    <div className="bg-slate-300 rounded-full w-2 h-2 hover:cursor-pointer" />
                    <div className="bg-slate-300 rounded-full w-2 h-2 hover:cursor-pointer" />
                    <div className="bg-slate-300 rounded-full w-2 h-2 hover:cursor-pointer" />
                  </div>
                  <Select value="all">
                    <SelectTrigger className="m-2 w-[110px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent className="right-[14%]">
                      <SelectItem value="all">
                        <div className="flex items-center text-[12px]">
                          <BsListTask className="mr-1 size-3" />
                          All Tasks
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div className="flex items-center text-[12px]">
                          <FaCheck className="mr-1 size-3" />
                          Completed
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center text-[12px]">
                          <RiRestTimeLine className="mr-1 size-3" />
                          Pending
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1 custom-scrollbar p-1 overflow-y-auto">
                  {Array.isArray(tasks) && tasks.map((task) => (
                    <div key={task._id} className="flex space-x-2 shadow-sm p-1.5 border rounded">
                      <div className="flex items-center space-x-1 w-[30%] font-semibold text-[12px] truncate">
                        {task.priority === 'high' && (<GoArrowUp />)}
                        {task.priority === 'medium' && (<GoArrowRight />)}
                        {task.priority === 'low' && (<GoArrowDown />)}
                        <span className="mr-2">{task.title}</span>
                      </div>
                      <div className="flex items-center w-[30%] h-5 text-[12px] text-gray-500 truncate">
                        {task.status === 'pending' && (<BsCheck className="mr-1 size-3" />)}
                        {task.status === 'in-progress' && (<BsCheck className="mr-1 size-3" />)}
                        {task.status === 'completed' && (<BsCheck className="mr-1 size-3" />)}
                        {task.status === 'expired' && (<BsCheck className="mr-1 size-3" />)}
                        <span className="font-medium">{task.status}</span>
                      </div>
                      <div className="w-[20%] text-[12px] text-gray-500 truncate">
                        <span className=""> {task.category}</span>
                      </div>
                      <div className="w-[20%] text-[12px] text-gray-500 truncate">
                        <span className="">{task.dueTime ? formatDate(task.dueTime as string, 'dd-MM-yy') : 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center p-2 border-t-2 h-[15%]">
                <p className="flex mr-2 text-[12px] text-nowrap">Progress: </p>
                <ProgressBar completed={2} pending={2} todo={1} />
              </div>
            </div>
          )}
          {/*Chart Overview*/}
          {settings.showProductivityInsights && (
            <div className="flex flex-col justify-between bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg w-full h-[30%]">
              <div className="flex justify-between items-center">
                <p className="m-2 font-semibold text-sm">
                  Productivity Insights
                </p>
                <Select value="pomo">
                  <SelectTrigger className="m-2 w-[100px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className="right-[20%]">
                    <SelectItem value="task">
                      <div className="flex items-center text-[12px]">
                        <BsListTask className="mr-1 size-3" />
                        Task
                      </div>
                    </SelectItem>
                    <SelectItem value="pomo">
                      <div className="flex items-center text-[12px]">
                        <GiTomato className="mr-1 size-3" />
                        Pomo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Chart />
            </div>
          )}
        </div>
      )}
      <div
        className={`relative flex flex-col bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg ${showLeftBar ? 'w-[75%]' : 'w-full'} h-full`}
      >
        <DragAndDropCalendar
          min={new Date(1970, 1, 1, 6, 0, 0)}
          max={new Date(1970, 1, 1, 23, 59, 59)}
          formats={{
            timeGutterFormat: 'h A',
          }}
          
          scrollToTime={scrollToTime}
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          draggableAccessor={() => true}
          eventPropGetter={eventPropGetter}
          events={myEvents}
          components={{
            event: CustomEvent, // Use your custom component
          }}
          localizer={localizer}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          resizable
          selectable
          popup
          style={{ height: "100%" }}
          className="p-2"
          step={15}
          timeslots={4}
        />
        <EventCalendar
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCloseChange={handleCloseDialog}
          selectedEvent={selectedCalendarEvent}
          setSelectedEvent={setSelectedCalendarEvent} // Pass the setter function
          setMyEvents={setMyEvents}
          handleConfirm={handleConfirmDelete}
        />
        <ChatAI />
      </div>
      {/* <button className="right-6 bottom-4 z-[100] absolute flex justify-center items-center bg-gradient-to-r from-indigo-500 to-cyan-400 p-[2px] rounded-full w-10 h-10">
        <div className="flex justify-center items-center bg-white rounded-full w-full h-full">
          <p className="bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400 font-bold text-center text-transparent text-xl">✨</p>
        </div>
      </button> */}
    </div>
  );
};

export default Home;
