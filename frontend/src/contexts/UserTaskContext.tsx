import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
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
  const user = useUser();

  // Save user ID to localStorage
  useEffect(() => {
    if (user.isSignedIn && user.user?.id) {
      localStorage.setItem('userId', user.user.id);
    } else {
      localStorage.removeItem('userId'); // Clear on logout
    }
  }, [user.isSignedIn, user.user?.id]);

  // Fetch tasks for the user
  const fetchTasks = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return; // Prevent fetching if no user ID is found

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}tasks/user/${userId}`,
      );
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
