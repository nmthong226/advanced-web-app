import React, { useState, useEffect, useCallback } from 'react';
//Import icons

//Import components
import { Button } from '../../components/ui/button.tsx';
import { ConfirmDialog } from '../../components/ui/confirm-dialog.tsx';
import { columns } from '../../components/table/ui/columns.tsx';
import { DataTable } from '../../components/table/ui/data-table.tsx';
import { TasksImportDialog } from '../../components/table/ui/tasks-import-dialog.tsx';
import { TasksMutateDrawer } from '../../components/table/ui/tasks-mutate-drawer.tsx';
import { Task } from '../../components/table/data/schema.ts';
import TasksContextProvider, {
  TasksDialogType,
  useTasksContext,
} from '../../components/table/context/task-context.tsx';
import ProgressBar from 'src/components/ProgressBar/ProgressBar.tsx';
import { Calendar } from "../../components/ui/calendar"

//Import hooks
import useDialogState from '@/hooks/use-dialog-state';
import axios from 'axios'; // Ensure axios is installed

import {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastAction,
} from 'src/components/ui/toast.tsx'; // Import ShadCN Toast components
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';
import { Download, Plus } from 'lucide-react';

const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);
const MemoizedTasksImportDialog = React.memo(TasksImportDialog);
const MemoizedConfirmDialog = React.memo(ConfirmDialog);

const Tasks = () => {
  const { tasks, setTasks, fetchTasks } = useTaskContext();
  const { open, currentRow, setCurrentRow, setOpen, handleOpen } = useTasksContext();
  const [pendingDeletes, setPendingDeletes] = useState<
    Map<string, NodeJS.Timeout>
  >(new Map());
  const [toastQueue, setToastQueue] = useState<{ id: string; task: Task }[]>(
    [],
  ); // Manage active toasts

  useEffect(() => {
    fetchTasks();
  }, []);

  // Callback to update the task list
  const handleTaskMutate = useCallback((task: Task, isUpdate: boolean) => {
    setTasks((prevTasks) => {
      if (isUpdate) {
        // Update an existing task
        return prevTasks.map((t) => (t.id === task.id ? task : t));
      } else {
        // Add a new task
        return [...prevTasks, task];
      }
    });
  }, []);
  const handleConfirmDelete = useCallback(() => {
    if (!currentRow) return;

    const taskId = currentRow.id;
    const taskToDelete = currentRow;

    // Temporarily remove the task from the list
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));

    // Create a timeout for permanent deletion
    const timeoutId = setTimeout(async () => {
      try {
        await axios.delete(`http://localhost:3000/tasks/${taskId}`);
        setToastQueue((prevQueue) =>
          prevQueue.filter((item) => item.id !== taskId),
        ); // Remove toast from queue
      } catch (error) {
        console.error('Error deleting task:', error);
        setTasks((prevTasks) => [...prevTasks, taskToDelete]); // Restore task if delete fails
      }
      setPendingDeletes((prev) => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });
    }, 10000); // 10 seconds timeout

    // Add the delete task to pendingDeletes map
    setPendingDeletes((prev) => {
      const newMap = new Map(prev);
      newMap.set(taskId, timeoutId);
      return newMap;
    });

    // Add toast for undo
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
      if (newMap.has(task.id)) {
        clearTimeout(newMap.get(task.id)); // Clear timeout
        newMap.delete(task.id);
      }
      return newMap;
    });
    setTasks((prevTasks) => [...prevTasks, task]); // Restore the task
    setToastQueue((prevQueue) =>
      prevQueue.filter((item) => item.id !== task.id),
    ); // Remove undo toast
  }, []);

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <ToastProvider>
      {/* Toast Viewport */}
      <ToastViewport />
      <div className='flex space-x-2 bg-indigo-50 p-2 w-full h-full overflow-x-hidden'>
        <div className='flex justify-center items-center bg-white rounded-md w-[16%] h-full overflow-hidden'>
          
        </div>
        <div className='flex flex-col bg-white border rounded-md w-[84%] h-full'>
          {/* ===== Top Heading ===== */}
          <div className="flex flex-wrap justify-between items-center gap-x-4 p-2">
            <button className='px-2 font-semibold text-indigo-500 text-lg'>
              TaskList
              <span className='ml-2 font-normal text-gray-500'>|</span>
              <span className='ml-2 font-normal text-[12px] text-gray-500'>This section manages your daily activity calendar.</span>
            </button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="space-x-1"
                onClick={() => handleOpen('import')}
              >
                <span>Import</span> <Download size={18} />
              </Button>
              <Button className="space-x-1" onClick={() => handleOpen('create')}>
                <span>Create</span> <Plus size={18} />
              </Button>
            </div>
          </div>
          <hr className='my-1 w-full' />
          {/* ===== Data Table ===== */}
          <div className="lg:flex-row flex-1 lg:space-x-12 lg:space-y-0 -mx-4 px-6 py-1 overflow-x-auto">
            <DataTable data={tasks} columns={columns} />
          </div>

          {/* ===== Mutate Drawer & Import Dialog ===== */}
          <MemoizedTasksMutateDrawer
            key="task-create"
            open={open === 'create'}
            onOpenChange={() => handleOpen('create')}
            onTaskMutate={handleTaskMutate}
          />
          <MemoizedTasksImportDialog
            key="tasks-import"
            open={open === 'import'}
            onOpenChange={() => handleOpen('import')}
          />
          {/* ===== Toasts for Undo ===== */}
          {toastQueue.map(({ id, task }) => (
            <Toast key={id} variant="default">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-sm">{task.title} deleted.</p>
                  <p className="text-xs">
                    Will be permanently removed in 10 seconds.
                  </p>
                </div>
                <ToastAction
                  altText="Undo Deletion"
                  asChild
                  onClick={() => undoDelete(task)}
                >
                  <Button variant="link" size="sm">
                    Undo
                  </Button>
                </ToastAction>
              </div>
            </Toast>
          ))}

          {/* ===== Update Drawer & Delete Dialog ===== */}
          {currentRow && (
            <>
              <MemoizedTasksMutateDrawer
                key={`task-update-${currentRow.id}`}
                open={open === 'update'}
                onOpenChange={() => {
                  handleOpen('update');
                  setTimeout(() => setCurrentRow(null), 500);
                }}
                currentRow={currentRow}
                onTaskMutate={handleTaskMutate}
              />
              <MemoizedConfirmDialog
                key="task-delete"
                destructive
                open={open === 'delete'}
                onOpenChange={() => {
                  handleOpen('delete');
                  setTimeout(() => {
                    setCurrentRow(null);
                  }, 500);
                }}
                handleConfirm={handleConfirmDelete}
                className="max-w-md"
                title={`Delete this task: ${currentRow?.id}?`}
                desc={
                  <>
                    You are about to delete a task with the ID{' '}
                    <strong>{currentRow?.id}</strong>. <br />
                    This action can be undone in 10 seconds.
                  </>
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
