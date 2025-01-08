import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Task } from '../types/task';

interface TaskContextValue {
  tasks: Task[];
  fetchTasks: () => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const UserTaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { userId } = useAuth();

  const fetchTasks = async () => {
    if (!userId) {
      console.warn('User ID is not available.');
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/tasks/user/${userId}`
      );
      console.log('fetch tasks by user_id', userId, tasks);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  return (
    <UserTaskContext.Provider value={{ tasks, setTasks, fetchTasks }}>
      {children}
    </UserTaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(UserTaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
