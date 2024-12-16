import React, { useState, useEffect, useCallback } from 'react';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { Button } from '../../components/ui/button.tsx';
import { ConfirmDialog } from '../../components/ui/confirm-dialog.tsx';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { TasksImportDialog } from './components/tasks-import-dialog';
import { TasksMutateDrawer } from './components/tasks-mutate-drawer';
import { Task } from './data/schema';
import TasksContextProvider, {
  TasksDialogType,
} from './context/task-context.tsx';
import useDialogState from '@/hooks/use-dialog-state';
import axios from 'axios'; // Ensure axios is installed
import ProgressBar from 'src/components/ProgressBar/ProgressBar.tsx';
import {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastAction,
} from 'src/components/ui/toast.tsx'; // Import ShadCN Toast components

const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);
const MemoizedTasksImportDialog = React.memo(TasksImportDialog);
const MemoizedConfirmDialog = React.memo(ConfirmDialog);

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentRow, setCurrentRow] = useState<Task | null>(null);
  const [open, setOpen] = useDialogState<TasksDialogType>(null);
  const [pendingDeletes, setPendingDeletes] = useState<
    Map<string, NodeJS.Timeout>
  >(new Map());
  const [toastQueue, setToastQueue] = useState<{ id: string; task: Task }[]>(
    [],
  ); // Manage active toasts

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/tasks/user/USER-1234',
        );
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleOpen = useCallback((type: TasksDialogType) => {
    setOpen(type);
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

  return (
    <TasksContextProvider value={{ open, setOpen, currentRow, setCurrentRow }}>
      <ToastProvider>
        {/* Toast Viewport */}
        <ToastViewport />

        {/* ===== Top Heading ===== */}
        <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
          <div></div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="space-x-1"
              onClick={() => handleOpen('import')}
            >
              <span>Import</span> <IconDownload size={18} />
            </Button>
            <Button className="space-x-1" onClick={() => handleOpen('create')}>
              <span>Create</span> <IconPlus size={18} />
            </Button>
          </div>
        </div>

        {/* ===== Data Table ===== */}
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
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
                <p className="text-sm font-semibold">{task.title} deleted.</p>
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
      </ToastProvider>
    </TasksContextProvider>
  );
};

export default Tasks;
