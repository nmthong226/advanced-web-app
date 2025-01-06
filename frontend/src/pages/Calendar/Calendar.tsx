// Import frameworks
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Import icons
import { BsListTask } from "react-icons/bs";

// Import styles
import "./style.css";

// Import components
import SideBarTask from "../../components/sidebar/sidebar_task.tsx";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, Views, EventPropGetter } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// Import libs/packages
import ChatAI from "../../components/AI/chatHistory.tsx";
import { Link } from "react-router-dom";
import CustomEvent from "./Event.tsx";

// Import contexts
import { useTaskContext } from "@/contexts/UserTaskContext.tsx";

// Types
interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  status: string;
}

interface DraggedEvent {
  _id: string;
  title: string;
  status: string;
}

interface Task {
  _id: string;
  title: string;
  category: string;
  status: string;
}

import { Task as TaskSchema } from "../../types/task.ts";
import { TasksMutateDrawer } from "../../components/table/ui/tasks-mutate-drawer.tsx";
import { useTasksContext } from "../../components/table/context/task-context.tsx";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop<Event>(Calendar);

const formatName = (name: string) => `${name}`;

//Task Schema
const mockTasks = [
  {
    _id: "1",
    userId: "123",
    title: "Complete Report",
    description: "Finalize the quarterly report",
    status: "in-progress",
    priority: "high",
    category: "Work",
    startTime: "2025-01-05T09:00:00Z",
    endTime: "2025-01-05T11:00:00Z",
    dueTime: "2025-01-05T23:59:59Z",
    estimatedTime: 120,
    color: "#FFDDC1",
    isOnCalendar: true,
  },
  {
    _id: "2",
    userId: "123",
    title: "Team Meeting",
    status: "pending",
    priority: "medium",
    category: "Work",
    startTime: "2025-01-06T10:00:00Z",
    endTime: "2025-01-06T11:00:00Z",
    color: "#C1E1FF",
    isOnCalendar: true,
  },
];

const convertTasksToEvents = (tasks: TaskSchema[]): Event[] => {
  return tasks
    .filter(task => task.startTime && task.endTime) // Filter only calendar-relevant tasks
    .map((task) => ({
      id: task._id, // Generate unique IDs
      title: task.title,
      status: task.status,
      start: new Date(task.startTime!), // Convert ISO 8601 string to Date
      end: new Date(task.endTime!),     // Convert ISO 8601 string to Date
      allDay: false, // Assuming tasks are not all-day by default
    }));
};

const convertTasksToDraggedEvents = (tasks: TaskSchema[]): Task[] => {
  return tasks
    .filter(task => !task.startTime && !task.endTime) // Filter only calendar-relevant tasks
    .map((task) => ({
      _id: task._id, // Generate unique IDs
      category: task.category,
      title: task.title,
      status: task.status,
      allDay: false, // Assuming tasks are not all-day by default
    }));
};

const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);

const MyCalendar: React.FC = () => {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<DraggedEvent | null>(null);
  const [draggableTasks, setDraggableTasks] = useState<Task[]>(mockTasks);
  const [displayDragItemInCell,] = useState<boolean>(true);

  const { handleOpen } = useTasksContext();

  const { tasks, setTasks } = useTaskContext(); // Access tasks from context

  useEffect(() => {
    const events = convertTasksToEvents(tasks);
    const draggableTask = convertTasksToDraggedEvents(tasks);
    setMyEvents(events);
    setDraggableTasks(draggableTask);
  }, [tasks, setTasks]);

  console.log(myEvents);

  const eventPropGetter: EventPropGetter<Event> = () => {
    return {
      className: "bg-indigo-50 shadow-lg border-0 text-xs",
      style: {
        borderRadius: "4px",
        color: "black",
      },
    };
  };

  const handleDragStart = useCallback((event: DraggedEvent) => setDraggedEvent(event), []);

  const dragFromOutsideItem = useCallback(
    () => {
      return (event: Event) => event.start;  // Or another Date field, such as `event.end`
    },
    [draggedEvent]
  );

  const moveEvent = useCallback(
    ({
      event,
      start,
      end,
      isAllDay: droppedOnAllDaySlot = false,
    }: {
      event: Event;
      start: Date;
      end: Date;
      isAllDay?: boolean;
    }) => {
      // Update the task context with new start and end times
      const updatedTasks = tasks.map((task) =>
        task._id === event.id ? { ...task, startTime: start.toISOString(), endTime: end.toISOString() } : task
      );

      // Update the task context
      setTasks(updatedTasks);

      // Update the event in the `myEvents` list
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);

        return [
          ...filtered,
          {
            ...existing,
            start,
            end,
            allDay: droppedOnAllDaySlot || event.allDay,
            id: event.id,
            title: event.title,
            status: event.status || "default", // Ensure status has a value
          },
        ];
      });
    },
    [tasks, setMyEvents, setTasks] // Adding `tasks` here to access the latest context value
  );


  // const newEvent = useCallback(
  //   (event: Omit<Event, "id"> & { id: string }) => {  // Ensure `id` is passed
  //     handleOpen('create');
  //     // setMyEvents((prev) => {
  //     //   return [...prev, { ...event }];
  //     // });
  //   },
  //   [setMyEvents]
  // );

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }: { start: Date; end: Date; allDay?: boolean }) => {
      if (draggedEvent) {
        const { title, status, _id } = draggedEvent;

        // Pass the task ID directly when creating the event
        const newEvent: Omit<Event, "id"> & { id: string } = {
          title: formatName(title),
          start,
          end,
          allDay: isAllDay,
          status: status || "default", // Ensure status has a value
          id: _id,  // Use the draggedEvent id directly
        };

        // Update the task context with new start and end time
        const updatedTasks = tasks.map((task) =>
          task._id === _id ? { ...task, startTime: start.toISOString(), endTime: end.toISOString() } : task
        );

        setTasks(updatedTasks);

        // Reset draggedEvent to null
        setDraggedEvent(null);

        // Update events list
        setMyEvents((prev) => [...prev, newEvent]);
      }
    },
    [draggedEvent, setDraggedEvent, setMyEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
      // Update tasks state
      const updatedTasks = tasks.map((task) =>
        task._id === event.id
          ? { ...task, startTime: start.toISOString(), endTime: end.toISOString() }
          : task
      );
      setTasks(updatedTasks);

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {
          allDay: false,
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          status: event.status
        };


        const filtered = prev.filter((ev) => ev.id !== event.id);

        return [
          ...filtered,
          {
            ...existing,
            start,
            end,
          },
        ];
      });
    },
    [tasks, setTasks, setMyEvents]
  );

  const defaultDate = useMemo(() => new Date(), [])

  return (
    <div className="relative flex items-center space-x-2 bg-indigo-50 dark:bg-slate-800 p-2 w-full h-full">
      <SideBarTask draggableTasks={draggableTasks} handleDragStart={handleDragStart} />
      <div className="relative flex flex-col justify-center bg-white dark:bg-slate-700 p-1 border rounded-lg w-[84%] h-full">
        <div className="flex flex-wrap justify-between items-center p-2">
          <div className="flex items-center">
            <button className="font-semibold text-indigo-500 text-lg dark:text-indigo-400">
              Task Calendar
              <span className="ml-2 font-normal text-[12px] text-gray-500 dark:text-gray-200">
                - This section manages your tasks on track.
              </span>
            </button>
          </div>
          <Link
            to="/task"
            className="flex items-center border-[1px] hover:bg-indigo-100/80 px-2 py-1 rounded-md text-gray-800 dark:text-white transition duration-200"
            title="Go to Task List"
          >
            <BsListTask className="mr-2" />
            <span className="font-medium">Task List</span>
          </Link>
        </div>
        <hr className="mb-2 w-full" />
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          dragFromOutsideItem={displayDragItemInCell ? dragFromOutsideItem : undefined}
          draggableAccessor={() => true}
          eventPropGetter={eventPropGetter}
          events={myEvents}
          components={{
            event: CustomEvent, // Use your custom component
          }}
          localizer={localizer}
          onDropFromOutside={onDropFromOutside}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onSelectSlot={() => handleOpen('create')}
          resizable
          selectable
          popup
          style={{ height: 690 }}
          className="px-2"
        />
        <MemoizedTasksMutateDrawer />
        <ChatAI />
      </div>
    </div>
  );
};

export default MyCalendar;
