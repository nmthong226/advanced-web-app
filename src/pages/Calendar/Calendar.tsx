// Import frameworks
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Import icons
import { BsListTask } from 'react-icons/bs';

// Import styles
import './style.css';

// Import components
import SideBarTask from '../../components/sidebar/sidebar_task.tsx';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { TasksMutateDrawer } from '../../components/table/ui/tasks-mutate-drawer.tsx';
import { useTasksContext } from '../../components/table/context/task-context.tsx';
import { ConfirmDialog } from '../../components/ui/confirm-dialog.tsx';

// Import libs/packages
import ChatAI from '../../components/AI/chatHistory.tsx';
import { Link } from 'react-router-dom';
import CustomEvent from './Event.tsx';

// Import contexts
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';

import EventCalendar from './EventCalendar.tsx';
import { updateTaskApi } from '@/api/tasks.api.ts';

// Import types
import { DraggedEvent, Event, Task, TaskItem } from '../../types/type.js';
import {
  convertTasksToDraggedEvents,
  convertTasksToEvents,
} from '@/lib/utils.ts';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUndoAlt } from 'react-icons/fa';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop<Event>(Calendar);

const formatName = (name: string) => `${name}`;

const isInThePast = (currentTime: Date) => {
  const now = new Date();
  return currentTime < now;
};

const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);
const MemoizedConfirmDialog = React.memo(ConfirmDialog);

const MyCalendar: React.FC = () => {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<DraggedEvent | null>(null);
  const [draggableTasks, setDraggableTasks] = useState<Task[]>([]);
  const [displayDragItemInCell] = useState<boolean>(true);
  const defaultDate = useMemo(() => new Date(), []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCalendarEvent, setSelectedCalendarEvent] =
    useState<Event | null>(null);
  const [, setPendingDeletes] = useState<Map<string, NodeJS.Timeout>>(
    new Map(),
  );
  const { open, setOpen, handleOpen } = useTasksContext();

  const { tasks, setTasks } = useTaskContext(); // Access tasks from context

  const [selectedEvent, setSelectedEvent] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    const events = convertTasksToEvents(tasks);
    console.log('convert task to events', events);
    const draggableTask = convertTasksToDraggedEvents(tasks);
    setMyEvents(events);
    setDraggableTasks(draggableTask);
  }, [tasks, setTasks]);

  const eventPropGetter = (event: Event) => {
    const isSelected = event._id === selectedCalendarEvent?._id;
  
    // Define category-based colors
    const categoryColors: { [key: string]: string } = {
      work: '(205, 193, 255, opacity_parameter)', // Blue in RGBA
      leisure: '(150, 233, 198, opacity_parameter)', // Green
      personal: '(253, 231, 103, opacity_parameter)', // Yellow
      urgent: '(255, 143, 143, opacity_parameter)', // Red
      default: '(238, 242, 255, opacity_parameter)', // Default color
    };
  
    // Determine opacity based on the event's status
    const getOpacity = (status: string) => {
      switch (status) {
        case 'completed':
          return 0.3; // Lower opacity for completed tasks
        case 'expired':
          return 0.3; // Very low opacity for expired tasks
        default:
          return 1; // Default full opacity
      }
    };
  
    // Function to format RGB(A) strings properly
    const formatColor = (color: string, opacity: number) => {
      if (color.startsWith('(')) {
        return `rgba${color.replace('opacity_parameter', `${opacity}`)}`; // Replace the placeholder with the actual opacity
      }
      return color; // Return as-is for HEX values
    };
  
    // Get the raw color based on the category or fallback to default
    const rawColor =
      categoryColors[
        event?.category?.toLowerCase() as keyof typeof categoryColors
      ] || categoryColors.default;
  
    // Calculate opacity based on event's status
    const opacity = getOpacity(event.status);
  
    // Format the color with the calculated opacity
    const backgroundColor = formatColor(rawColor, opacity);
  
    return {
      className: `shadow-lg text-xs`,
      style: {
        backgroundColor: isSelected ? '#ccc' : backgroundColor, // Gray for selected, category color for others
        color: isSelected ? '#555' : 'black', // Adjust text color if needed
        border: '1px solid #A7BBC7',
        textDecoration:
          event.status === 'completed' || event.status === 'expired'
            ? 'line-through'
            : 'none',
      },
    };
  };

  const handleDragStart = useCallback(
    (event: DraggedEvent) => setDraggedEvent(event),
    [],
  );

  const dragFromOutsideItem = useCallback(() => {
    return (event: Event) => event.start; // Or another Date field, such as `event.end`
  }, [draggedEvent]);

  const moveEvent = useCallback(
    async ({
      event,
      start,
      end,
      isAllDay: droppedOnAllDaySlot = false,
    }: {
      event: any;
      start: any;
      end: any;
      isAllDay?: boolean;
    }) => {
      // Update the task context with new start and end times
      const timezoneOffsetInMinutes = start.getTimezoneOffset();

      // Create new Date objects adjusted for local time zone
      const localStart = new Date(
        start.getTime() - timezoneOffsetInMinutes * 60000,
      );
      const localEnd = new Date(
        end.getTime() - timezoneOffsetInMinutes * 60000,
      );

      // Use the adjusted local times to create ISO strings without offset
      const newStatus = isInThePast(localEnd) ? 'expired' : 'pending';
      const updateTaskTimeDto = {
        startTime: localStart.toISOString(),
        endTime: localEnd.toISOString(),
        status: newStatus,
      };

      const updatedTasks = tasks.map((task) =>
        task._id === event._id
          ? {
              ...task,
              startTime: start.toISOString(),
              endTime: end.toISOString(),
            }
          : task,
      );

      console.log('Sending time update:', updateTaskTimeDto);

      // Update the task context
      setTasks(updatedTasks);
      console.log('updated tasks', updatedTasks);

      // Update the event in the `myEvents` list
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev._id === event._id) ?? {};
        const filtered = prev.filter((ev) => ev._id !== event._id);

        return [
          ...filtered,
          {
            ...existing,
            start,
            end,
            allDay: droppedOnAllDaySlot || event.allDay,
            _id: event._id,
            userId: event.userId,
            title: event.title,
            status: newStatus, // Ensure status has a value
            category: event.category,
            priority: event.priority,
          },
        ];
      });

      // Send updates to the backend

      try {
        // Make the backend request to update the task
        const response = await updateTaskApi(event._id, updateTaskTimeDto);
        console.log('move response', response);
        if (response) {
          console.log('Task updated successfully:', response);
          // Optionally, update state again after a successful backend update
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === event._id
                ? {
                    ...task,
                    startTime: localStart.toISOString(),
                    endTime: localEnd.toISOString(),
                    status: newStatus,
                  }
                : task,
            ),
          );
        }
      } catch (error) {
        console.error(`Failed to update task with ID ${event._id}:`, error);
      }
    },
    [tasks, myEvents, setMyEvents, setTasks], // Adding `tasks` to ensure we access the latest context value
  );

  console.log('myEvents:', myEvents);

  const onDropFromOutside = useCallback(
    async ({
      start,
      end,
      allDay: isAllDay,
    }: {
      start: any;
      end: any;
      allDay?: any;
    }) => {
      if (!draggedEvent) return;

      const timezoneOffsetInMinutes = start.getTimezoneOffset();

      // Create new Date objects adjusted for local time zone
      const localStart = new Date(
        start.getTime() - timezoneOffsetInMinutes * 60000,
      );
      const localEnd = new Date(
        end.getTime() - timezoneOffsetInMinutes * 60000,
      );

      // Use the adjusted local times to create ISO strings without offset
      const newStatus = isInThePast(localEnd) ? 'expired' : 'pending';
      const updateTaskTimeDto = {
        startTime: localStart.toISOString(),
        endTime: localEnd.toISOString(),
        status: newStatus,
      };

      const { title, _id, userId, category } = draggedEvent;

      // Create a new event object
      const newEvent: Omit<Event, '_id'> & { _id: string } = {
        title: formatName(title),
        start: localStart,
        end: localEnd,
        allDay: isAllDay || false,
        status: newStatus || 'pending', // Ensure status has a value
        userId: userId,
        _id: _id, // Use the draggedEvent id directly
        category,
        priority: draggedEvent.priority,
      };

      // Update tasks state locally
      const updatedTasks = tasks.map((task) =>
        task._id === _id
          ? {
              ...task,
              startTime: localStart.toISOString(),
              endTime: localEnd.toISOString(),
            }
          : task,
      );

      setTasks(updatedTasks);

      // Reset draggedEvent to null
      setDraggedEvent(null);

      // Update events list
      setMyEvents((prev) => [...prev, newEvent]);

      // Send updates to the backend
      try {
        console.log('Sending time update:', updateTaskTimeDto);

        // Use the correct ID for the backend request
        const response = await updateTaskApi(_id, updateTaskTimeDto);

        if (response) {
          console.log('Task updated successfully:', response);

          // Update tasks state again if needed
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === _id
                ? {
                    ...task,
                    startTime: localStart.toISOString(),
                    endTime: localEnd.toISOString(),
                    status: newStatus,
                  }
                : task,
            ),
          );
        }
      } catch (error) {
        console.error(`Failed to update task with ID ${_id}:`, error);
      }
    },
    [draggedEvent, tasks, setDraggedEvent, setMyEvents, setTasks],
  );

  const resizeEvent = useCallback(
    async ({ event, start, end }: { event: any; start: any; end: any }) => {
      // Update tasks state
      const timezoneOffsetInMinutes = start.getTimezoneOffset();

      // Create new Date objects adjusted for local time zone
      const localStart = new Date(
        start.getTime() - timezoneOffsetInMinutes * 60000,
      );
      const localEnd = new Date(
        end.getTime() - timezoneOffsetInMinutes * 60000,
      );

      // Use the adjusted local times to create ISO strings without offset
      const newStatus = isInThePast(localEnd) ? 'expired' : 'pending';
      const updateTaskTimeDto = {
        startTime: localStart.toISOString(),
        endTime: localEnd.toISOString(),
        status: newStatus,
      };
      const updatedTasks = tasks.map((task) =>
        task._id === event._id
          ? {
              ...task,
              startTime: localStart.toISOString(),
              endTime: localEnd.toISOString(),
            }
          : task,
      );

      console.log('Sending time update:', updateTaskTimeDto);

      // Update the task context
      setTasks(updatedTasks);

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev._id === event._id) ?? {
          allDay: false,
          _id: event._id,
          userId: event.userId,
          title: event.title,
          start: event.start,
          end: event.end,
          status: event.status,
          category: event.category,
          priority: event.priority,
        };

        const filtered = prev.filter((ev) => ev._id !== event._id);

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
        const response = await updateTaskApi(event._id, updateTaskTimeDto);
        if (response) {
          setTasks((prevTasks) => {
            return prevTasks.map((task) => {
              if (task._id === event._id) {
                return {
                  ...task,
                  startTime: localStart.toISOString(),
                  endTime: localEnd.toISOString(),
                  status: newStatus,
                };
              }
              return task;
            });
          });
        }
        console.log(`Task with ID ${event._id} updated successfully.`);
      } catch (error) {
        console.error(`Failed to update task with ID ${event._id}:`, error);
      }
    },
    [tasks, setTasks, setMyEvents],
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
    handleOpen('create');
  };

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
    toast.success(<p className="text-sm">Task restored successfully!</p>);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedCalendarEvent) return;

    const taskId = selectedCalendarEvent._id as string;
    console.log(`Deleting task with ID ${taskId}`);
    const taskToDelete = selectedCalendarEvent;

    // Temporarily remove the task from the list
    setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));

    // Track if the delete was undone
    let isUndone = false;

    // Show toast with undo option
    const toastId = toast.error(
      <div className="flex items-center space-x-2 text-sm">
        <p>Task deleted. </p>
        <button
          onClick={() => {
            undoDelete(taskToDelete); // Restore the task
            isUndone = true; // Mark as undone
            toast.dismiss(toastId); // Close the toast immediately
          }}
          className="flex items-center border-white px-2 py-0.5 border rounded-md font-semibold text-indigo-100"
        >
          <FaUndoAlt className="mr-1 size-3" />
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
                await axios.delete(
                  `${import.meta.env.VITE_BACKEND}/tasks/${taskId}`,
                );
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

  const [scrollToTime] = useState(
    new Date(1970, 1, 1, new Date().getHours(), 0, 0), // Default to this hour
  );

  return (
    <div className="relative flex items-center space-x-2 bg-indigo-50 dark:bg-slate-800 p-2 w-full h-full">
      <SideBarTask
        draggableTasks={draggableTasks}
        handleDragStart={handleDragStart}
      />
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
          min={new Date(1970, 1, 1, 6, 0, 0)}
          max={new Date(1970, 1, 1, 23, 59, 59)}
          formats={{
            timeGutterFormat: 'h A',
          }}
          scrollToTime={scrollToTime}
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          dragFromOutsideItem={
            displayDragItemInCell ? dragFromOutsideItem : undefined
          }
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
          step={15}
          timeslots={4}
        />
        <MemoizedTasksMutateDrawer
          start={selectedEvent.start}
          end={selectedEvent.end}
        />
        {/* ===== Update Drawer & Delete Dialog ===== */}
        <MemoizedConfirmDialog
          destructive
          open={open === 'delete'}
          onOpenChange={() => setOpen(null)}
          handleConfirm={handleConfirmDelete}
          title={`Confirm Delete`}
          desc={
            <p>
              Are you sure you want to delete{' '}
              <strong>{selectedCalendarEvent?.title}?</strong>
            </p>
          }
          confirmText="Delete"
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
    </div>
  );
};

export default MyCalendar;
