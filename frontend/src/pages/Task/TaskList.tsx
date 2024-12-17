import React, { useState, useCallback } from 'react';

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

// Import ShadCN Toast components
import {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastAction,
} from 'src/components/ui/toast.tsx';
import { IoCalendarOutline } from 'react-icons/io5';
import { Plus } from 'lucide-react';

const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);
const MemoizedConfirmDialog = React.memo(ConfirmDialog);

const Tasks = () => {
  const { tasks, setTasks } = useTaskContext();

  console.log(tasks);

  const { open, currentRow, setCurrentRow, setOpen, handleOpen } =
    useTasksContext();
  const [, setPendingDeletes] = useState<Map<string, NodeJS.Timeout>>(
    new Map(),
  );
  const [toastQueue, setToastQueue] = useState<{ id: string; task: Task }[]>(
    [],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!currentRow) return;

    const taskId = currentRow._id;
    const taskToDelete = currentRow;

    // Temporarily remove the task from the list
    setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));

    // Create a timeout for permanent deletion
    const timeoutId = setTimeout(async () => {
      try {
        await axios.delete(
          `https://nestbackend1-giejxmpnz-quyhoaphantruongs-projects.vercel.app/tasks/${taskId}`,
        );
        setToastQueue((prevQueue) =>
          prevQueue.filter((item) => item.id !== taskId),
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
    }, 4000); // 10 seconds timeout

    setPendingDeletes((prev) => {
      const newMap = new Map(prev);
      newMap.set(taskId, timeoutId);
      return newMap;
    });

    setToastQueue((prevQueue) => [
      ...prevQueue,
      { id: taskId, task: taskToDelete },
    ]);
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
    setToastQueue((prevQueue) =>
      prevQueue.filter((item) => item.id !== task._id),
    );
  }, []);

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // // Step 1: Count tasks per category
  // const categoryCounts = tasks?.reduce<Record<string, number>>(
  //   (counts, task) => {
  //     counts[task.category] = (counts[task.category] || 0) + 1;
  //     return counts;
  //   },
  //   {},
  // );

  // // Step 2: Sort categories by task count and get the top 10
  // const currentCategories = Object.entries(categoryCounts)
  //   .filter(([, count]) => count > 0) // Filter categories with tasks
  //   .sort(([, countA], [, countB]) => countB - countA) // Sort by task count in descending order
  //   .slice(0, 10); // Get top 10 or all current categories

  return (
    <ToastProvider>
      <ToastViewport />
      <div className="flex space-x-2 bg-indigo-50 p-2 w-full h-full overflow-x-hidden">
        <div className="flex flex-col items-center bg-white p-2 rounded-md w-[16%] h-full overflow-hidden">
          <div className="flex items-center space-x-2 bg-gradient-to-t from-indigo-500 to-blue-400 px-2 p-1.5 border rounded-md w-full text-white">
            <IoCalendarOutline />
            <p>Calendar</p>
          </div>
          <hr className="my-2 border-t w-full" />
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-1 border rounded-md scale-95"
          />
          <hr className="my-2 border-t w-full" />
          <p className="text-gray-600 text-xs">Your current tasks category</p>
          {/* <ul className="mt-4 w-full list-disc">
            {currentCategories.map(([category, count]) => (
              <li
                key={category}
                className="flex justify-between items-center py-2"
              >
                <span className="text-gray-700 text-sm">{category}</span>
                <span className="text-gray-500 text-xs">{count} tasks</span>
              </li>
            ))}
          </ul> */}
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

          {/* ===== Toasts for Undo ===== */}
          {toastQueue.map(({ id, task }) => (
            <Toast key={id} variant="default">
              <div className="flex justify-between">
                <p>{task.title} deleted.</p>
                <ToastAction
                  altText="Undo Deletion"
                  onClick={() => undoDelete(task)}
                >
                  Undo
                </ToastAction>
              </div>
            </Toast>
          ))}

          {/* ===== Update Drawer & Delete Dialog ===== */}
          {currentRow && (
            <>
              <MemoizedConfirmDialog
                destructive
                open={open === 'delete'}
                onOpenChange={() => setOpen(null)}
                handleConfirm={handleConfirmDelete}
                title={`Delete this task: ${currentRow?._id}?`}
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
    </ToastProvider>
  );
};

export default Tasks;
