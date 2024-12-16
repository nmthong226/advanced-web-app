import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Task } from '../data/schema';
import { useTaskContext } from '@/contexts/TasksContext';

export type TasksDialogType = 'create' | 'update' | 'delete' | 'import';

interface TasksContextType {
  open: TasksDialogType | null;
  setOpen: (str: TasksDialogType | null) => void;
  currentRow: Task | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>;
  handleOpen: (type: TasksDialogType) => void;
}

const TasksContext = React.createContext<TasksContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function TasksContextProvider({ children }: Props) {
  const [open, setOpen] = useState<TasksDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<Task | null>(null);

  const handleOpen = useCallback((type: TasksDialogType) => {
    setOpen(type);
  }, []);
  
  return (
    <TasksContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        handleOpen,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

// Custom hook để sử dụng TasksContext
export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error(
      'useTasksContext must be used within a <TasksContextProvider>',
    );
  }
  return context;
};
