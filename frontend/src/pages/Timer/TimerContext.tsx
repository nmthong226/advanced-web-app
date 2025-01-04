import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Define types
type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  startTime?: string;
  endTime?: string;
  dueTime?: string;
  estimatedTime: number; // Estimated Pomodoros
  pomodorosCompleted: number; // Completed Pomodoros
  style: {
    backgroundColor: string;
    textColor: string;
  };
  isOnCalendar: boolean;
}

// Context state type
interface TimerContextState {
  mode: Mode;
  time: number;
  isActive: boolean;
  pomodoroCount: number;
  tasks: Task[];
  selectedTask: Task | null;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  handleModeChange: (newMode: Mode) => void;
  handlePomodoroCompletion: () => void;
  resetTimer: () => void;
}
// Props for TimerProvider
interface TimerProviderProps {
  children: ReactNode;
}
// Default values for context
const TimerContext = createContext<TimerContextState | undefined>(undefined);

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [time, setTime] = useState(1500); // 25 minutes default for Pomodoro
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const longBreakInterval = 4;

  // Helper function to get default time
  const getDefaultTime = (currentMode: Mode): number => {
    switch (currentMode) {
      case 'pomodoro':
        return 1500; // 25 minutes
      case 'shortBreak':
        return 300; // 5 minutes
      case 'longBreak':
        return 900; // 15 minutes
      default:
        return 1500;
    }
  };

  // Handle mode changes
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false); // Pause timer
    setTime(getDefaultTime(newMode)); // Reset time
  };

  // Handle Pomodoro completion
  const handlePomodoroCompletion = () => {
    if (!selectedTask) return;

    // Update task's completed Pomodoros
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === selectedTask._id
          ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 }
          : task,
      ),
    );

    // Increment pomodoro count
    setPomodoroCount((prev) => prev + 1);

    // If task is complete, mark it
    if (selectedTask.pomodorosCompleted + 1 >= selectedTask.estimatedTime) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id
            ? { ...task, status: 'completed' }
            : task,
        ),
      );
    }

    // Update mode based on interval
    if ((pomodoroCount + 1) % longBreakInterval === 0) {
      handleModeChange('longBreak');
    } else {
      handleModeChange('shortBreak');
    }

    setTime(getDefaultTime(mode));
  };

  // Reset Timer
  const resetTimer = () => {
    setIsActive(false);
    setTime(getDefaultTime(mode));
  };

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      setIsActive(false);
      handlePomodoroCompletion();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, selectedTask, pomodoroCount]);

  // Provide context
  return (
    <TimerContext.Provider
      value={{
        mode,
        time,
        isActive,
        pomodoroCount,
        tasks,
        selectedTask,
        setTasks,
        setSelectedTask,
        setIsActive,
        handleModeChange,
        handlePomodoroCompletion,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// Hook to use context
export const useTimerContext = (): TimerContextState => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};
