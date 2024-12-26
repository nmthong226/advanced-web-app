import React, { useState, useCallback, useEffect } from 'react';

// Import components
import { Button } from '../../components/ui/button.tsx';
import { ConfirmDialog } from '../../components/ui/confirm-dialog.tsx';
import { columns } from '../../components/table/ui/columns.tsx';
import { DataTable } from '../../components/table/ui/data-table.tsx';
import { TasksMutateDrawer } from '../../components/table/ui/tasks-mutate-drawer.tsx';
import { Task } from '../../components/table/data/schema.ts';
import { Calendar } from '../../components/ui/calendar.tsx';

// Import hooks
import { useTasksContext } from 'src/components/table/context/task-context.tsx';
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';
import axios from 'axios';

//Import icons
import { IoCalendarOutline } from 'react-icons/io5';
import { Plus } from 'lucide-react';
import { FaUndoAlt } from "react-icons/fa";

//Import libs/packages
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);
const MemoizedConfirmDialog = React.memo(ConfirmDialog);

const Tasks = () => {
  const { tasks, setTasks } = useTaskContext();
  const [currentCategories, setCurrentCategories] = useState<[string, number][]>([]);
  const { open, currentRow, setCurrentRow, setOpen, handleOpen } = useTasksContext();
  const [, setPendingDeletes] = useState<Map<string, NodeJS.Timeout>>(
    new Map(),
  );

  const handleConfirmDelete = useCallback(() => {
    if (!currentRow) return;

    const taskId = currentRow._id;
    const taskToDelete = currentRow;

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

    setCurrentRow(null);
    setOpen(null);
  }, [currentRow, setTasks, setOpen, setPendingDeletes]);

  const undoDelete = useCallback((task: Task) => {
    setPendingDeletes((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(task._id)) {
        clearTimeout(newMap.get(task._id));
        newMap.delete(task._id);
      }
      return newMap;
    });
    setTasks((prevTasks) => [...prevTasks, task]);
    toast.success(
      <p className='text-sm'>Task restored successfully!</p>
    );
  }, []);


  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Step 1: Handle undefined or invalid tasks
  function processTasks(tasks: { category: string }[] | undefined) {
    if (!tasks || !Array.isArray(tasks)) {
      console.error("Tasks are undefined or not an array.");
      return { categoryCounts: {}, currentCategories: [] };
    }

    // Step 2: Count tasks per category
    const categoryCounts = tasks.reduce<Record<string, number>>((counts, task) => {
      if (task.category) {
        counts[task.category] = (counts[task.category] || 0) + 1;
      }
      return counts;
    }, {});

    // Step 3: Sort categories by task count and get the top 10
    const currentCategories = Object.entries(categoryCounts)
      .filter(([, count]) => count > 0) // Filter categories with tasks
      .sort(([, countA], [, countB]) => countB - countA) // Sort by task count in descending order
      .slice(0, 10); // Get top 10 or all current categories

    return { categoryCounts, currentCategories };
  }

  useEffect(() => {
    // Process tasks whenever tasks in the context change
    const { currentCategories } = processTasks(tasks);
    setCurrentCategories(currentCategories);
  }, [tasks]); // Dependency array ensures this runs when `tasks` updates


  return (
    <div className="flex space-x-2 bg-indigo-50 p-2 w-full h-full overflow-x-hidden">
      <div className="flex flex-col items-center bg-white p-2 rounded-md w-[16%] h-full overflow-hidden">
        <Link to={"/calendar"} className="flex items-center space-x-2 bg-gradient-to-t from-indigo-500 to-blue-400 px-2 p-1.5 border rounded-md w-full text-white">
          <IoCalendarOutline />
          <p>Task Calendar</p>
        </Link>
        <hr className="my-2 border-t w-full" />
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-1 border rounded-md scale-95"
        />
        <hr className="my-2 border-t w-full" />
        <p className="text-gray-600 text-xs">Your current tasks category</p>
        <ul className="mt-4 w-full list-disc">
          {currentCategories.map(([category, count]) => (
            <li
              key={category}
              className="flex justify-between items-center py-2"
            >
              <span className="text-gray-700 text-sm">{category}</span>
              <span className="text-gray-500 text-xs">{count} tasks</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col bg-white border rounded-md w-[84%] h-full">
        {/* ===== Top Heading ===== */}
        <div className="flex flex-wrap justify-between items-center gap-x-4 p-2">
          <button className="px-2 font-semibold text-indigo-500 text-lg">
            TaskList
            <span className="ml-2 font-normal text-gray-500">|</span>
            <span className="ml-2 font-normal text-[12px] text-gray-500">
              This section manages your daily activity calendar.
            </span>
          </button>

          <Button onClick={() => handleOpen('create')} className="">
            Create <Plus size={12} />
          </Button>
        </div>
        <hr className="mb-2 w-full" />
        {/* ===== Data Table ===== */}
        <DataTable data={tasks} columns={columns} />

        <MemoizedTasksMutateDrawer />

        {/* ===== Update Drawer & Delete Dialog ===== */}
        {currentRow && (
          <>
            <MemoizedConfirmDialog
              destructive
              open={open === 'delete'}
              onOpenChange={() => setOpen(null)}
              handleConfirm={handleConfirmDelete}
              title={`Delete this task: ${currentRow?.title}?`}
              desc={
                <p>
                  You are about to delete task{' '}
                  <strong>{currentRow?.title}</strong>.
                </p>
              }
              confirmText="Delete"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Tasks;
