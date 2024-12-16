import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

//Import packages
import axios from "axios";

//Import data schema
import { Task } from '../components/table/data/schema.ts';

interface TaskContextValue {
    tasks: Task[];
    fetchTasks: () => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}
const UserTaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    // const fetchTasks = async () => {
    //     try {
    //         const response = await axios.get(
    //             'http://localhost:3000/tasks/user/USER-1234',
    //         );
    //         setTasks(response.data);
    //     } catch (error) {
    //         console.error('Error fetching tasks:', error);
    //     }
    // };

    const [taskSchedule, setTaskSchedule] = useState<TaskSchedule[]>([]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(
                import.meta.env.VITE_TEST_BACKEND,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true', // Skip Ngrok security warning
                    },
                },
            );
            console.log("TEST", response.data);
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
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};