// src/contexts/UserTaskContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

import { TaskItem } from '../types/type';

interface TaskContextValue {
  tasks: TaskItem[];
  fetchTasks: () => void;
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  addTask: (task: TaskItem) => void;
  deleteTask: (taskId: string) => void;
  editTask: (updatedTask: TaskItem) => void;
}

const UserTaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Fetch tasks based on authentication status
  const fetchTasks = async () => {
    if (isSignedIn && userId) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND}/tasks/user/${userId}`,
        );
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    } else {
      // Unauthenticated users: Load tasks from localStorage or initialize with empty array
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]); // Start with no tasks
      }
    }
  };

  // Fetch tasks when authentication status changes
  useEffect(() => {
    if (isLoaded) {
      fetchTasks();
    }
  }, [isLoaded, isSignedIn, userId]);

  // Persist tasks to localStorage for unauthenticated users
  useEffect(() => {
    if (!isSignedIn) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // Optionally, clear tasks from state when user signs out
    // Uncomment the following lines if you want to clear tasks on sign-out
    // if (isLoaded && !isSignedIn) {
    //   setTasks([]);
    // }
  }, [tasks, isSignedIn]);

  // Function to add a new task
  const addTask = (task: TaskItem) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Function to delete a task
  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  // Function to edit a task
  const editTask = (updatedTask: TaskItem) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task,
      ),
    );
  };

  return (
    <UserTaskContext.Provider
      value={{ tasks, setTasks, fetchTasks, addTask, deleteTask, editTask }}
    >
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
