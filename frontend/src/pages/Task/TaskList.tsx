import React from 'react';
import { useState, useCallback } from 'react';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { Button } from '../../components/ui/button.tsx';
import { ConfirmDialog } from '../../components/ui/confirm-dialog.tsx';
import { columns } from '../../components/table/ui/columns.tsx';
import { DataTable } from '../../components/table/ui/data-table.tsx';
import { TasksImportDialog } from '../../components/table/ui/tasks-import-dialog.tsx';
import { TasksMutateDrawer } from '../../components/table/ui/tasks-mutate-drawer.tsx';
import { Task } from '../../components/table/data/schema.ts';
import TasksContextProvider, {
  TasksDialogType,
} from '../../components/table/context/task-context.tsx';
import { toast } from '@/hooks/use-toast';
import useDialogState from '@/hooks/use-dialog-state';
import { tasks } from '../../components/table/data/tasks.ts';
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
        <pre className="bg-slate-950 mt-2 p-4 rounded-md w-[340px]">
          <code className="text-white">
            {JSON.stringify(currentRow, null, 2)}
          </code>
        </pre>
      ),
    });
  }, [currentRow, setOpen]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-start w-full h-full overflow-hidden">
        {/* <SideBarActivity /> */}
        <div className="px-2 w-full h-full">
          <TasksContextProvider
            value={{ open, setOpen, currentRow, setCurrentRow }}
          >
            {/* ===== Top Heading ===== */}
            <div className="flex flex-wrap justify-between items-center gap-x-4 space-y-2 mb-2.5 w-full">
              <div></div>
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
            <hr className='my-1 border-b w-full' />
            {/* ===== Data Table ===== */}
            <div className="lg:flex-row flex-1 lg:space-x-12 lg:space-y-0 -mx-4 px-4 py-1 overflow-auto">
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
