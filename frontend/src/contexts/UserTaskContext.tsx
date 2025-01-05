import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';
import { useAuth, useClerk } from '@clerk/clerk-react';
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
  const { userId, getToken } = useAuth();

  const fetchTasks = async () => {
    try {
      const token = await getToken(); // Get the authentication token
      if (!token) {
        console.warn('Token is not available.');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
          },
        },
      );

      setTasks(response.data); // Update the state with the retrieved tasks
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
