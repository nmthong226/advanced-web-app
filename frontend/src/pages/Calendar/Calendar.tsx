// Import frameworks
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Import icons
import { BsListTask } from "react-icons/bs";

// Import styles
import "./style.css";

// Import components
import SideBarTask from "../../components/sidebar/sidebar_task.tsx";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { TasksMutateDrawer } from "../../components/table/ui/tasks-mutate-drawer.tsx";
import { useTasksContext } from "../../components/table/context/task-context.tsx";

// Import libs/packages
import ChatAI from "../../components/AI/chatHistory.tsx";
import { Link } from "react-router-dom";
import CustomEvent from "./Event.tsx";

// Import contexts
import { useTaskContext } from "@/contexts/UserTaskContext.tsx";

import EventCalendar from "./EventCalendar.tsx";
import { updateTaskApi } from "@/api/tasks.api.ts";

// Import types
import { Task as TaskSchema } from "../../types/task.ts";
import { DraggedEvent, Event, Task } from "../../types/type.js";
import { convertTasksToEvents } from "@/lib/utils.ts";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop<Event>(Calendar);

const formatName = (name: string) => `${name}`;

const isInThePast = (currentTime: Date) => {
  const now = new Date();
  return currentTime < now;
};

const convertTasksToDraggedEvents = (tasks: TaskSchema[]): Task[] => {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return []; // Return an empty array if tasks is null, undefined, or empty
  }
  return tasks
    .filter(task => !task.startTime && !task.endTime) // Filter only calendar-relevant tasks
    .map((task) => ({
      _id: task._id as string, // Generate unique IDs
      category: task.category,
      title: task.title,
      status: task.status,
      priority: task.priority,
      allDay: false, // Assuming tasks are not all-day by default
    }));
};

const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);

const MyCalendar: React.FC = () => {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<DraggedEvent | null>(null);
  const [draggableTasks, setDraggableTasks] = useState<Task[]>([]);
  const [displayDragItemInCell,] = useState<boolean>(true);
  const defaultDate = useMemo(() => new Date(), [])
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<Event | null>(null);

  const { handleOpen } = useTasksContext();

  const { tasks, setTasks } = useTaskContext(); // Access tasks from context

  const [selectedEvent, setSelectedEvent] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    const events = convertTasksToEvents(tasks);
    const draggableTask = convertTasksToDraggedEvents(tasks);
    setMyEvents(events);
    setDraggableTasks(draggableTask);
  }, [tasks, setTasks]);

  const eventPropGetter = (event: Event) => {
    const isSelected = event.id === selectedCalendarEvent?.id;

    // Define category-based colors
    const categoryColors: { [key: string]: string } = {
      work: "#6895D2", // Blue
      leisure: "#96E9C6", // Green
      personal: "#FDE767", // Yellow
      urgent: "#FC4100", // Red
      default: "#EEF2FF", // Default color
    };

    // Get the background color based on category or fallback to default
    const backgroundColor =
      categoryColors[event?.category?.toLowerCase() as keyof typeof categoryColors] || categoryColors.default;

    return {
      className: "bg-indigo-50 shadow-lg border-0 text-xs",
      style: {
        backgroundColor: isSelected ? "#ccc" : backgroundColor, // Gray for selected, category color for others
        color: isSelected ? "#555" : "black", // Adjust text color if needed
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
    async ({
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
      const timezoneOffsetInMinutes = start.getTimezoneOffset();

      // Create new Date objects adjusted for local time zone
      const localStart = new Date(start.getTime() - timezoneOffsetInMinutes * 60000);
      const localEnd = new Date(end.getTime() - timezoneOffsetInMinutes * 60000);

      // Use the adjusted local times to create ISO strings without offset
      const newStatus = isInThePast(localEnd) ? 'expired' : 'pending';
      const updateTaskTimeDto = {
        startTime: localStart.toISOString(),
        endTime: localEnd.toISOString(),
        status: newStatus,
      };
      const updatedTasks = tasks.map((task) =>
        task._id === event.id ? { ...task, startTime: start.toISOString(), endTime: end.toISOString() } : task
      );

      console.log("Sending time update:", updateTaskTimeDto);

      // Update the task context
      setTasks(updatedTasks);
      console.log('updated tasks', updatedTasks)

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
            status: newStatus, // Ensure status has a value
          },
        ];
      });

      // Send updates to the backend

      try {

        // Make the backend request to update the task
        const response = await updateTaskApi(event.id, updateTaskTimeDto);
        console.log('move response', response);
        if (response) {
          console.log("Task updated successfully:", response);
          // Optionally, update state again after a successful backend update
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === event.id
                ? { ...task, startTime: localStart.toISOString(), endTime: localEnd.toISOString(), status: newStatus }
                : task
            )
          );
        }
      } catch (error) {
        console.error(`Failed to update task with ID ${event.id}:`, error);
      }
    },
    [tasks, myEvents, setMyEvents, setTasks] // Adding `tasks` to ensure we access the latest context value
  );

  console.log("myEvents:", myEvents);

  const onDropFromOutside = useCallback(
    async ({ start, end, allDay: isAllDay }: { start: Date; end: Date; allDay?: boolean }) => {
      if (!draggedEvent) return;

      const timezoneOffsetInMinutes = start.getTimezoneOffset();

      // Create new Date objects adjusted for local time zone
      const localStart = new Date(start.getTime() - timezoneOffsetInMinutes * 60000);
      const localEnd = new Date(end.getTime() - timezoneOffsetInMinutes * 60000);

      // Use the adjusted local times to create ISO strings without offset
      const newStatus = isInThePast(localEnd) ? 'expired' : 'pending';
      const updateTaskTimeDto = {
        startTime: localStart.toISOString(),
        endTime: localEnd.toISOString(),
        status: newStatus,
      };

      const { title, _id, category } = draggedEvent;

      // Create a new event object
      const newEvent: Omit<Event, "id"> & { id: string } = {
        title: formatName(title),
        start: localStart,
        end: localEnd,
        allDay: isAllDay || false,
        status: newStatus || "pending", // Ensure status has a value
        id: _id, // Use the draggedEvent id directly
        category,
      };

      // Update tasks state locally
      const updatedTasks = tasks.map((task) =>
        task._id === _id ? { ...task, startTime: localStart.toISOString(), endTime: localEnd.toISOString() } : task
      );

      setTasks(updatedTasks);

      // Reset draggedEvent to null
      setDraggedEvent(null);

      // Update events list
      setMyEvents((prev) => [...prev, newEvent]);

      // Send updates to the backend
      try {

        console.log("Sending time update:", updateTaskTimeDto);

        // Use the correct ID for the backend request
        const response = await updateTaskApi(_id, updateTaskTimeDto);

        if (response) {
          console.log("Task updated successfully:", response);

          // Update tasks state again if needed
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === _id
                ? { ...task, startTime: localStart.toISOString(), endTime: localEnd.toISOString(), status: newStatus }
                : task
            )
          );
        }
      } catch (error) {
        console.error(`Failed to update task with ID ${_id}:`, error);
      }
    },
    [draggedEvent, tasks, setDraggedEvent, setMyEvents, setTasks]
  );

  const resizeEvent = useCallback(
    async ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
      // Update tasks state
      const timezoneOffsetInMinutes = start.getTimezoneOffset();

      // Create new Date objects adjusted for local time zone
      const localStart = new Date(start.getTime() - timezoneOffsetInMinutes * 60000);
      const localEnd = new Date(end.getTime() - timezoneOffsetInMinutes * 60000);

      // Use the adjusted local times to create ISO strings without offset
      const newStatus = isInThePast(localEnd) ? 'expired' : 'pending';
      const updateTaskTimeDto = {
        startTime: localStart.toISOString(),
        endTime: localEnd.toISOString(),
        status: newStatus,
      };
      const updatedTasks = tasks.map((task) =>
        task._id === event.id ? { ...task, startTime: localStart.toISOString(), endTime: localEnd.toISOString() } : task
      );

      console.log("Sending time update:", updateTaskTimeDto);

      // Update the task context
      setTasks(updatedTasks);

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {
          allDay: false,
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          status: event.status,
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

      // Send updates to the backend
      try {
        console.log("time", updateTaskTimeDto);

        const response = await updateTaskApi(event.id, updateTaskTimeDto);

        if (response) {
          console.log("1", response);
          setTasks((prevTasks) => {
            return prevTasks.map((task) => {
              if (task._id === event.id) {
                return {
                  ...task,
                  startTime: localStart.toISOString(),
                  endTime: localEnd.toISOString(),
                  status: newStatus,
                };
              }
              return task;
            });
          })
        }
        console.log(`Task with ID ${event.id} updated successfully.`);
      } catch (error) {
        console.error(`Failed to update task with ID ${event.id}:`, error);
      }
    },
    [tasks, setTasks, setMyEvents]
  );

  const handleSelectEvent = (event: Event) => {
    setSelectedCalendarEvent(event); // Set the selected event data
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setSelectedCalendarEvent(null); // Clear the selected event
    }, 100);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const { start, end } = slotInfo;
    setSelectedEvent({ start, end });
    handleOpen("create");
  }

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
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          resizable
          selectable
          popup
          style={{ height: 690 }}
          className="px-2"
        />
        <MemoizedTasksMutateDrawer start={selectedEvent.start} end={selectedEvent.end} />
        <EventCalendar
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCloseChange={handleCloseDialog}
          selectedEvent={selectedCalendarEvent}
          setSelectedEvent={setSelectedCalendarEvent} // Pass the setter function
          setMyEvents={setMyEvents}
        />
        <ChatAI />
      </div>
    </div>
  );
};

export default MyCalendar;
