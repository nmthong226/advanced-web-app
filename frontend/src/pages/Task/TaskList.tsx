import React from 'react';
import { useState, useCallback } from 'react';
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
import { toast } from '@/hooks/use-toast';
import useDialogState from '@/hooks/use-dialog-state';
import { tasks } from './data/tasks';
import SideBarActivity from '../../components/sidebar/sidebar_activity.tsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// Memoize these components to prevent unnecessary re-renders
const MemoizedTasksMutateDrawer = React.memo(TasksMutateDrawer);
const MemoizedTasksImportDialog = React.memo(TasksImportDialog);
const MemoizedConfirmDialog = React.memo(ConfirmDialog);

const Tasks = () => {
  // Local states
  const [currentRow, setCurrentRow] = useState<Task | null>(null);
  const [open, setOpen] = useDialogState<TasksDialogType>(null);

  // Handler functions moved out of JSX to reduce re-renders
  const handleOpen = useCallback((type: TasksDialogType) => {
    setOpen(type);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setOpen(null);
    setTimeout(() => {
      setCurrentRow(null);
    }, 500);
    toast({
      title: 'The following task has been deleted:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(currentRow, null, 2)}
          </code>
        </pre>
      ),
    });
  }, [currentRow, setOpen]);

  const handleClose = useCallback(() => {
    setOpen(null);
    setCurrentRow(null);
  }, [setOpen]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-start w-full h-full">
        <SideBarActivity />

        <div className="w-full h-full">
          <TasksContextProvider
            value={{ open, setOpen, currentRow, setCurrentRow }}
          >
            {/* ===== Top Heading ===== */}
            <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
                <p>Here&apos;s a list of your tasks for this month!</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="space-x-1"
                  onClick={() => handleOpen('import')}
                >
                  <span>Import</span> <IconDownload size={18} />
                </Button>
                <Button
                  className="space-x-1"
                  onClick={() => handleOpen('create')}
                >
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
            />
            <MemoizedTasksImportDialog
              key="tasks-import"
              open={open === 'import'}
              onOpenChange={() => handleOpen('import')}
            />

            {/* ===== Update Drawer & Delete Dialog (Conditional Rendering) ===== */}
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
                  title={`Delete this task: ${currentRow.id} ?`}
                  desc={
                    <>
                      You are about to delete a task with the ID{' '}
                      <strong>{currentRow.id}</strong>. <br />
                      This action cannot be undone.
                    </>
                  }
                  confirmText="Delete"
                />
              </>
            )}
          </TasksContextProvider>
        </div>
      </div>
    </DndProvider>
  );
};
export default Tasks;
