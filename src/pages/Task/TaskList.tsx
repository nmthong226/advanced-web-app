import React, { useState, useCallback, useEffect } from 'react';

// Import components
import { ConfirmDialog } from 'src/components/ui/confirm-dialog.tsx';
import { columns } from '../../components/table/ui/columns.tsx';
import { DataTable } from '../../components/table/ui/data-table.tsx';
import { TasksMutateDrawer } from '../../components/table/ui/tasks-mutate-drawer.tsx';
import { Task } from '../../components/table/data/schema.ts';
import { Calendar } from '../../components/ui/calendar.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu.tsx';
import ChatAI from '../../components/AI/chatHistory.tsx';

// Import hooks
import { useTasksContext } from 'src/components/table/context/task-context.tsx';
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';
import axios from 'axios';

//Import icons
import { IoCalendarOutline } from 'react-icons/io5';
import { FaUndoAlt } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { MdTaskAlt } from 'react-icons/md';
import { GoTag } from 'react-icons/go';

//Import libs/packages
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';

const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);
const MemoizedConfirmDialog = React.memo(ConfirmDialog);

const Tasks = () => {
  const { tasks, setTasks } = useTaskContext();
  const [currentCategories, setCurrentCategories] = useState<
    [string, number][]
  >([]);
  
  const { open, currentRow, setCurrentRow, setOpen, handleOpen } =
    useTasksContext();
  const [, setPendingDeletes] = useState<Map<string, NodeJS.Timeout>>(
    new Map(),
  );
  const allCategories = ['work', 'leisure', 'personal', 'urgent'];

  const handleConfirmDelete = useCallback(() => {
    if (!currentRow) return;

    const taskId = currentRow._id as string;
    const taskToDelete = currentRow;

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

    setCurrentRow(null);
    setOpen(null);
  }, [currentRow, setTasks, setOpen, setPendingDeletes]);

  const undoDelete = useCallback((task: Task) => {
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

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Step 1: Handle undefined or invalid tasks
  function processTasks(tasks: { category?: string }[] | undefined, allCategories: string[]) {
    if (!tasks || !Array.isArray(tasks)) {
      console.error('Tasks are undefined or not an array.');
      return { categoryCounts: {}, currentCategories: [] };
    }

    // Step 1: Initialize counts for all categories (including zero-count ones)
    const categoryCounts = allCategories.reduce<Record<string, number>>((counts, category) => {
      counts[category] = 0; // Start with zero for all categories
      return counts;
    }, {});

    // Step 2: Count tasks per category
    tasks.forEach((task) => {
      if (task.category && categoryCounts.hasOwnProperty(task.category)) {
        categoryCounts[task.category] += 1;
      }
    });

    // Step 3: Sort categories by task count and get the top 10 (if needed)
    const currentCategories = Object.entries(categoryCounts)
      .sort(([, countA], [, countB]) => countB - countA); // Sort by task count in descending order

    return { categoryCounts, currentCategories };
  }

  useEffect(() => {
    const { currentCategories } = processTasks(tasks, allCategories);
    setCurrentCategories(currentCategories);
  }, [tasks]);

  // Define category-based colors
  const categoryColors: { [key: string]: string } = {
    work: "#CDC1FF", // Blue
    leisure: "#96E9C6", // Green
    personal: "#FDE767", // Yellow
    urgent: "#FF8F8F", // Red
    default: "#EEF2FF", // Default color
  };

  return (
    <div className="flex space-x-2 bg-indigo-50 dark:bg-slate-800 p-2 w-full h-full overflow-x-hidden">
      <div className="flex flex-col items-center bg-white dark:bg-slate-700 p-2 border rounded-md w-[16%] h-full overflow-hidden">
        <div className="flex justify-between items-center space-x-2 bg-gradient-to-t from-indigo-500 to-blue-400 py-1.5 pl-2 border rounded-md w-full text-white">
          <button
            className="flex justify-center items-center space-x-2 w-full text-center"
            onClick={() => handleOpen('create')}
          >
            <p className="text-center">Add Task</p>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex justify-center items-center border-l w-8">
                <IoIosArrowDown className="size-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 mr-[182px] w-[214px]">
              <DropdownMenuItem className="flex items-center">
                <MdTaskAlt />
                Add Task
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <GoTag /> Add Tag
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <hr className="mt-2 border-t w-full" />
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-1 border rounded-md scale-95"
        />
        <hr className="my-2 border-t w-full" />
        <p className="my-2 text-gray-600 text-xs dark:text-gray-200">
          Your current tasks category
        </p>
        {/* <div className='flex justify-between items-center space-x-2 my-2 w-full'>
          <div className='flex items-center space-x-1 px-2 p-1 border rounded-md text-zinc-500'>
            <p className='text-[12px]'>Sort:</p>
            <FaSortAmountUp className='size-3' />
          </div>
          <div className='flex p-1 border rounded-md'>
            <IoTrashBinOutline className='text-zinc-500 size-4' />
          </div>
        </div> */}
        <ul className="w-full list-disc">
          {currentCategories.map(([category, count]) => (
            <li
              key={category}
              className="flex justify-between items-center py-1"
            >
              <span className="flex items-center space-x-1 text-[12px] text-gray-700 dark:text-gray-200 capitalize">
                {category === 'work' && <p>💼</p>}
                {category === 'leisure' && <p>🧩</p>}
                {category === 'personal' && <p>🪅</p>}
                {category === 'urgent' && <p>💥</p>}
                <p>{category}</p>
              </span>
              <span
                className={cn(
                  `text-[12px] px-2 text-gray-500 dark:text-gray-300 rounded-md`
                )}
                style={{ backgroundColor: categoryColors[category.toLowerCase()] || categoryColors.default }}
              >
                {count}
              </span>
            </li>
          ))}
        </ul>
        <button className="mt-2 py-0.5 p-2 border border-dotted rounded-md w-full text-[12px] text-muted-foreground">
          Add category
        </button>
      </div>
      <div className="relative flex flex-col bg-white dark:bg-slate-700 p-1 border rounded-md w-[84%] h-full">
        {/* ===== Top Heading ===== */}
        <div className="flex flex-wrap justify-between items-center p-2">
          <button className="font-semibold text-indigo-400 text-lg">
            Task List
            <span className="ml-2 font-normal text-[12px] text-gray-500 dark:text-gray-200">
              - This section manages your daily activity calendar.
            </span>
          </button>
          <Link
            to="/calendar"
            className="flex items-center border-[1px] border-gray-300 hover:bg-indigo-100/80 px-2 py-1 dark:border-black rounded-md text-gray-800 dark:text-gray-200 transition duration-200"
            title="Go to Task List"
          >
            <IoCalendarOutline className="mr-2" />
            <span className="font-medium">Task Calendar</span>
          </Link>
        </div>
        <hr className="w-full" />
        {/* ===== Data Table ===== */}
        <DataTable data={tasks} columns={columns} />

        <MemoizedTasksMutateDrawer start={null} end={null} />

        {/* ===== Update Drawer & Delete Dialog ===== */}
        {currentRow && (
          <>
            <MemoizedConfirmDialog
              destructive
              open={open === 'delete'}
              onOpenChange={() => setOpen(null)}
              handleConfirm={handleConfirmDelete}
              title={`Confirm Delete`}
              desc={
                <p>
                  Are you sure you want to delete {' '}
                  <strong>{currentRow?.title}?</strong>
                </p>
              }
              confirmText="Delete"
            />
          </>
        )}
        <ChatAI />
      </div>
    </div>
  );
};

export default Tasks;
