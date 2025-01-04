// src/components/Timer.tsx

import { useEffect, useState } from 'react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import PomoSettings from '../../components/pomosettings/PomoSettings';
import { GiTomato } from 'react-icons/gi';
import { IoMdMore } from 'react-icons/io';
import { Trash, Trash2 } from 'lucide-react';
import { BsFillSkipEndFill } from 'react-icons/bs';
import { FaRegChartBar } from 'react-icons/fa';

// Define the Task type
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
  pomodorosCompleted: number; // Pomodoros Completed
  style: {
    backgroundColor: string;
    textColor: string;
  };
  isOnCalendar: boolean;
}

const Timer = () => {
  // Timer States
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>(
    'pomodoro',
  );
  const [time, setTime] = useState<number>(1500); // 25 minutes in seconds
  const [isActive, setIsActive] = useState<boolean>(false);

  // Interval Tracking for Long Breaks
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const longBreakInterval = 4; // After 4 Pomodoros, take a Long Break
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

    // Update global pomodoro count
    setPomodoroCount((prevCount) => prevCount + 1);

    // Handle task status and mode
    if (
      selectedTask.pomodorosCompleted + 1 >= selectedTask.estimatedTime &&
      selectedTask.status !== 'completed'
    ) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id
            ? { ...task, status: 'completed' }
            : task,
        ),
      );
    }

    // Recalculate time and update mode
    if ((pomodoroCount + 1) % longBreakInterval === 0) {
      handleModeChange('longBreak');
    } else {
      handleModeChange('shortBreak');
    }

    // Update estimated finish time
    setTime(getDefaultTime(mode));
  };

  // Function to calculate total estimated time
  const calculateTotalEstimatedTime = (): string => {
    let totalSeconds = 0;

    tasks.forEach((task) => {
      const pomoCount = task.estimatedTime;
      const fullCycles = Math.floor(pomoCount / 4); // Number of full cycles (4 Pomos each)
      const remainingPomos = pomoCount % 4; // Remaining Pomos outside of full cycles

      // Time for full cycles
      totalSeconds += fullCycles * (4 * 1500 + 900); // 4 Pomos + 1 Long Break per cycle

      // Time for remaining Pomodoros
      totalSeconds += remainingPomos * 1500; // Remaining Pomodoros
      totalSeconds += (remainingPomos > 0 ? remainingPomos - 1 : 0) * 300; // Short breaks for remaining Pomodoros
    });

    // Format total time as hh:mm
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  // Task States with Mock Data
  const [tasks, setTasks] = useState<Task[]>([
    {
      _id: '1',
      userId: 'user123',
      title: 'Write blog post',
      description: 'Draft the new blog post on React hooks.',
      status: 'in-progress',
      priority: 'high',
      category: 'Work',
      startTime: new Date().toISOString(),
      endTime: new Date(new Date().getTime() + 1500 * 1000).toISOString(),
      dueTime: new Date(new Date().getTime() + 3600 * 1000).toISOString(),
      estimatedTime: 1, // 1 Pomodoro
      pomodorosCompleted: 0, // Initially 0
      style: {
        backgroundColor: '#FFCDD2',
        textColor: '#B71C1C',
      },
      isOnCalendar: true,
    },
    {
      _id: '2',
      userId: 'user123',
      title: 'Read a book',
      description: 'Finish reading "Clean Code" by Robert C. Martin.',
      status: 'pending',
      priority: 'medium',
      category: 'Personal',
      startTime: '',
      endTime: '',
      dueTime: new Date(new Date().getTime() + 7200 * 1000).toISOString(),
      estimatedTime: 2, // 2 Pomodoros
      pomodorosCompleted: 0, // Initially 0
      style: {
        backgroundColor: '#C8E6C9',
        textColor: '#1B5E20',
      },
      isOnCalendar: false,
    },
    // You can add more mock tasks here
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Selected Task State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Edit Task Inline States
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
  const [editingEstimatedPomodoros, setEditingEstimatedPomodoros] =
    useState<number>(1);

  // Modal State for Adding Task
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Function to handle background color based on the mode
  const getBackgroundColor = () => {
    switch (mode) {
      case 'shortBreak':
        return 'bg-[#368356]/10 transition-colors duration-500';
      case 'longBreak':
        return 'bg-blue-100 transition-colors duration-500';
      default:
        return 'bg-red-100 transition-colors duration-500';
    }
  };

  const startButtonColor = () => {
    switch (mode) {
      case 'shortBreak':
        return 'bg-[#368356]/70';
      case 'longBreak':
        return 'bg-blue-700/70';
      default:
        return 'bg-red-700/70';
    }
  };

  // Function to format time in mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Function to get default time based on mode
  const getDefaultTime = (
    currentMode: 'pomodoro' | 'shortBreak' | 'longBreak',
  ): number => {
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

  // Handle mode change
  const handleModeChange = (
    newMode: 'pomodoro' | 'shortBreak' | 'longBreak',
  ) => {
    setMode(newMode);
    setIsActive(false); // Pause timer
    setTime(getDefaultTime(newMode)); // Reset time
    // Note: Do not deselect the task here to maintain selection
  };
  const handleFinishTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status: 'completed',
              pomodorosCompleted: task.estimatedTime, // Mark all Pomodoros as completed
            }
          : task,
      ),
    );

    // If the selected task is finished, deselect it and reset the timer
    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask(null);
      setIsActive(false);
      setTime(getDefaultTime(mode));
    }
  };

  const handleModeTitle = (
    currentMode: 'pomodoro' | 'shortBreak' | 'longBreak',
  ): string => {
    switch (currentMode) {
      case 'pomodoro':
        return 'Time to Focus!';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Time to Focus!';
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false); // Stop timer
      if (selectedTask) {
        handlePomodoroCompletion(); // Update completed Pomodoros for the task

        // Increment global pomodoro count
        setPomodoroCount((prevCount) => prevCount + 1);

        // Mark task as completed if pomodorosCompleted >= estimatedTime
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === selectedTask._id &&
            task.pomodorosCompleted + 1 >= task.estimatedTime
              ? { ...task, status: 'completed' }
              : task,
          ),
        );

        // Determine next mode after updating pomodoroCount and task status
        if ((pomodoroCount + 1) % longBreakInterval === 0) {
          handleModeChange('longBreak');
        } else {
          handleModeChange('shortBreak');
        }
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, selectedTask, pomodoroCount, longBreakInterval]);

  // Update document title with time and mode
  useEffect(() => {
    document.title = `${formatTime(time)} - ${handleModeTitle(mode)}`;
  }, [time, mode]);

  // Handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    // If the task being deleted is the selected task, stop the timer
    if (selectedTask && selectedTask._id === taskId) {
      setIsActive(false);
      setSelectedTask(null);
      setTime(getDefaultTime(mode));
    }

    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  // Handle selecting a task
  const handleSelectTask = (task: Task) => {
    if (isActive && selectedTask && selectedTask._id !== task._id) {
      // If a different task is already active, confirm switch
      if (
        window.confirm(
          'A timer is already running for another task. Do you want to switch to this task? The current timer will be paused.',
        )
      ) {
        setIsActive(false);
        setSelectedTask(task);
        setTime(getDefaultTime(mode));
      }
    } else {
      setSelectedTask(task);
      setTime(getDefaultTime(mode));
    }
  };

  // Handle skipping a Pomodoro or Break
  const handleSkip = () => {
    if (!selectedTask) {
      alert('Please select a task to skip Pomodoro.');
      return;
    }

    if (mode === 'pomodoro') {
      // Increment pomodorosCompleted
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id
            ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 }
            : task,
        ),
      );

      // Increment global pomodoro count
      setPomodoroCount((prevCount) => prevCount + 1);

      // Mark task as completed if pomodorosCompleted >= estimatedTime
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id &&
          task.pomodorosCompleted + 1 >= task.estimatedTime
            ? { ...task, status: 'completed' }
            : task,
        ),
      );

      // Determine next mode
      if ((pomodoroCount + 1) % longBreakInterval === 0) {
        handleModeChange('longBreak');
      } else {
        handleModeChange('shortBreak');
      }
    } else if (mode === 'shortBreak' || mode === 'longBreak') {
      // Transition back to Pomodoro mode
      handleModeChange('pomodoro');
    }

    setIsActive(false); // Stop the timer
    setTime(
      getDefaultTime(
        mode === 'pomodoro'
          ? (pomodoroCount + 1) % longBreakInterval === 0
            ? 'longBreak'
            : 'shortBreak'
          : 'pomodoro',
      ),
    );
    // Do not deselect the task to keep it selected
  };

  // Calculate total Pomodoros planned and completed
  const totalPomodorosPlanned = tasks.reduce(
    (acc, task) => acc + task.estimatedTime,
    0,
  );
  const totalPomodorosCompleted = tasks.reduce(
    (acc, task) => acc + task.pomodorosCompleted,
    0,
  );

  // Calculate estimated finish time based on selected task and Pomodoros
  const estimatedFinishTime = selectedTask
    ? new Date(new Date().getTime() + time * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  // Handle initiating edit for a task
  const initiateEditTask = (task: Task) => {
    setEditingTaskId(task._id);
    setEditingTaskTitle(task.title);
    setEditingEstimatedPomodoros(task.estimatedTime);
    setError(null);
  };

  // Handle saving edited task
  const saveEditedTask = (taskId: string) => {
    if (!editingTaskTitle.trim()) {
      setError('Task title is required.');
      return;
    }

    // Update the task in the tasks state
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              title: editingTaskTitle,
              estimatedTime: editingEstimatedPomodoros,
            }
          : task,
      ),
    );

    // If the edited task is the selected task, update its estimatedTime
    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask((prevSelected) =>
        prevSelected
          ? {
              ...prevSelected,
              title: editingTaskTitle,
              estimatedTime: editingEstimatedPomodoros,
            }
          : null,
      );
    }

    setEditingTaskId(null);
    setError(null);
  };

  // Handle canceling edit
  const cancelEditTask = () => {
    setEditingTaskId(null);
    setError(null);
  };

  // Function to open the Add Task Modal
  const openAddTaskModal = () => {
    setIsAddModalOpen(true);
  };

  // Function to close the Add Task Modal
  const closeAddTaskModal = () => {
    setIsAddModalOpen(false);
  };

  // Function to handle selecting a task from the modal
  const handleAddTaskFromModal = (task: Task) => {
    setSelectedTask(task);
    setTime(getDefaultTime(mode));
    setIsAddModalOpen(false);
  };

  // Function to calculate real completion time
  const calculateCompletionTime = (): string => {
    let totalSeconds = 0;

    tasks.forEach((task) => {
      const pomoCount = task.estimatedTime;
      const fullCycles = Math.floor(pomoCount / 4); // Number of full cycles (4 Pomos each)
      const remainingPomos = pomoCount % 4; // Remaining Pomos outside of full cycles

      // Time for full cycles
      totalSeconds += fullCycles * (4 * 1500 + 900); // 4 Pomos + 1 Long Break per cycle

      // Time for remaining Pomodoros
      totalSeconds += remainingPomos * 1500; // Remaining Pomodoros
      totalSeconds += (remainingPomos > 0 ? remainingPomos - 1 : 0) * 300; // Short breaks for remaining Pomodoros
    });

    // Get the current time
    const currentTime = new Date();

    // Calculate completion time by adding totalSeconds
    const completionTime = new Date(
      currentTime.getTime() + totalSeconds * 1000,
    );

    // Format the time as hh:mm AM/PM
    return completionTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateCompletionTimeWithRemaining = (): string => {
    let totalSeconds = 0;

    tasks.forEach((task) => {
      const remainingPomos = task.estimatedTime - task.pomodorosCompleted;
      if (remainingPomos <= 0) return; // Skip completed tasks

      const fullCycles = Math.floor(remainingPomos / 4); // Full 4-pomo cycles
      const leftoverPomos = remainingPomos % 4; // Remaining Pomodoros

      // Full cycle time
      totalSeconds += fullCycles * (4 * 1500 + 900); // 4 Pomos + 1 Long Break

      // Remaining Pomodoro time
      totalSeconds += leftoverPomos * 1500; // Pomodoro durations
      totalSeconds += (leftoverPomos > 0 ? leftoverPomos - 1 : 0) * 300; // Short breaks
    });

    const currentTime = new Date();
    const completionTime = new Date(
      currentTime.getTime() + totalSeconds * 1000,
    );

    // Calculate hours and minutes left
    const hoursLeft = Math.floor(totalSeconds / 3600);
    const minutesLeft = Math.floor((totalSeconds % 3600) / 60);

    // Format completion time
    const formattedTime = completionTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedTime} (${hoursLeft} hr ${minutesLeft} min left)`;
  };

  return (
    <div
      className={`flex flex-col w-full min-h-screen ${getBackgroundColor()} relative overflow-hidden`}
    >
      <div className="flex flex-col w-full flex-grow justify-start items-center">
        {/* Header */}
        <div className="flex w-full px-8 py-1 justify-center items-center bg-white/70">
          <div className="flex justify-between w-[500px] py-1">
            <div className="flex justify-center items-center text-lg font-bold text-zinc-700">
              <GiTomato className="mr-2" />
              <p>Pomofocus</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center rounded-md p-1 px-4 bg-white shadow-md text-zinc-700 font-semibold hover:bg-gray-100 transition">
                <FaRegChartBar className="mr-2" />
                Report
              </button>
              <PomoSettings /> {/* Settings Button */}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-center mt-10 w-full px-4">
          <div className="flex flex-col justify-between items-center w-full max-w-md h-auto bg-white rounded-lg shadow-md p-6">
            {/* Mode Selection */}
            <div className="flex space-x-4 w-full justify-center text-sm mb-6">
              <button
                onClick={() => handleModeChange('pomodoro')}
                className={`p-2 px-4 rounded-md font-bold ${
                  mode === 'pomodoro'
                    ? 'bg-red-600 text-white'
                    : 'text-[#5f341f] hover:bg-red-100'
                } transition-colors`}
              >
                Pomodoro
              </button>
              <button
                onClick={() => handleModeChange('shortBreak')}
                className={`p-2 px-4 rounded-md font-bold ${
                  mode === 'shortBreak'
                    ? 'bg-[#368356] text-white'
                    : 'text-[#5f341f] hover:bg-green-100'
                } transition-colors`}
              >
                Short Break
              </button>
              <button
                onClick={() => handleModeChange('longBreak')}
                className={`p-2 px-4 rounded-md font-bold ${
                  mode === 'longBreak'
                    ? 'bg-blue-600 text-white'
                    : 'text-[#5f341f] hover:bg-blue-100'
                } transition-colors`}
              >
                Long Break
              </button>
            </div>

            {/* Timer Display */}
            <div className="flex justify-center mb-6">
              <p className="text-8xl font-semibold text-[#5f341f]">
                {formatTime(time)}
              </p>
            </div>

            {/* Start/Pause and Skip Buttons */}
            <div className="flex w-full h-12 justify-center items-center relative space-x-4">
              {/* Start/Pause Button */}
              <button
                onClick={() => {
                  if (selectedTask) {
                    setIsActive(!isActive);
                    if (!isActive) {
                      // If starting the timer, update task status to 'in-progress'
                      setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                          task._id === selectedTask._id
                            ? { ...task, status: 'in-progress' }
                            : task,
                        ),
                      );
                    }
                  } else {
                    alert('Please select a task to work on.');
                  }
                }}
                className={`flex-1 h-full p-2 rounded-md ${startButtonColor()} text-white text-lg font-semibold hover:brightness-90 transition`}
              >
                <p>{isActive ? 'Pause' : 'Start'}</p>
              </button>

              {/* Skip Button (Visible Only When Active) */}
              {isActive && (
                <button
                  onClick={handleSkip}
                  className="flex-1 h-full p-2 rounded-md bg-gray-300 text-gray-800 text-lg font-semibold hover:bg-gray-400 transition flex justify-center items-center"
                  aria-label="Skip Pomodoro"
                >
                  <BsFillSkipEndFill className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mode Title and Selected Task */}
        <div className="flex flex-col items-center justify-center mt-6 w-full px-4">
          {/* Dynamic Pomodoro Count Display */}
          <p className="text-[#5f341f] text-lg font-bold">#{pomodoroCount}</p>
          <p className="text-[#5f341f]">{handleModeTitle(mode)}</p>

          {/* Selected Task Display */}
          {selectedTask && (
            <div
              className={`mt-2 p-4 rounded-md w-full max-w-md text-center transition-colors ${
                selectedTask.status === 'completed'
                  ? 'bg-green-100'
                  : 'bg-gray-200'
              }`}
            >
              <p className="text-lg font-semibold">{selectedTask.title}</p>
              {selectedTask.status === 'completed' && (
                <p className="text-sm text-green-700">Completed!</p>
              )}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="flex flex-col items-center justify-center mt-3 space-y-5 w-full px-4">
          {/* Tasks Header */}
          <div className="flex w-full max-w-md h-full justify-between items-center border-b-2 border-gray-300 py-2">
            <p className="text-lg font-bold text-[#5f341f]">Tasks</p>
            <div className="flex space-x-2">
              {/* Add Task Button */}
              <button
                onClick={openAddTaskModal}
                className="flex items-center px-4 py-2 bg-[#5f341f] text-white rounded-md hover:bg-[#793d2b] transition"
              >
                Add Task
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 bg-white shadow-md rounded-md hover:bg-gray-100 transition">
                    <IoMdMore className="h-6 w-6 text-gray-700" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={() => alert('Delete all tasks')}
                    >
                      <Trash className="mr-2" />
                      <span>Delete all tasks</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => alert('Clear finished tasks')}
                    >
                      <Trash2 className="mr-2" />
                      <span>Clear finished tasks</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Display Tasks */}
          <div className="flex flex-col w-full max-w-md mt-4">
            {isLoading && <p>Loading tasks...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && tasks.length === 0 && <p>No tasks available.</p>}
            {!isLoading && tasks.length > 0 && (
              <ul className="space-y-2 overflow-auto max-h-64">
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className={`flex flex-col p-4 bg-white shadow-md rounded-md cursor-pointer ${
                      selectedTask && selectedTask._id === task._id
                        ? 'border-2 border-blue-500'
                        : ''
                    } hover:bg-gray-50 transition-colors`}
                    onClick={() => handleSelectTask(task)} // Added onClick handler for task selection
                  >
                    {/* If this task is being edited, show the edit card */}
                    {editingTaskId === task._id ? (
                      <div className="flex flex-col space-y-4">
                        {/* Task Title Input */}
                        <div className="flex flex-col">
                          <Label
                            htmlFor={`edit-title-${task._id}`}
                            className="font-bold mb-1"
                          >
                            Task Title
                          </Label>
                          <Input
                            id={`edit-title-${task._id}`}
                            type="text"
                            value={editingTaskTitle}
                            onChange={(e) =>
                              setEditingTaskTitle(e.target.value)
                            }
                            className="bg-white shadow-inner placeholder-gray-400 rounded-md"
                            required
                          />
                        </div>

                        {/* Pomodoro Counters */}
                        <div className="flex items-center space-x-4">
                          <div>
                            <Label
                              htmlFor={`current-pomos-${task._id}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Completed Pomodoros
                            </Label>
                            <p className="mt-1 text-lg text-gray-900">
                              {task.pomodorosCompleted} / {task.estimatedTime}
                            </p>
                          </div>
                          <div>
                            <Label
                              htmlFor={`estimated-pomos-${task._id}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Estimated Pomodoros
                            </Label>
                            <div className="flex items-center mt-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingEstimatedPomodoros(
                                    Math.max(1, editingEstimatedPomodoros - 1),
                                  )
                                }
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 transition"
                                aria-label="Decrease Pomodoros"
                              >
                                -
                              </button>
                              <Input
                                type="number"
                                id={`estimated-pomos-${task._id}`}
                                value={editingEstimatedPomodoros}
                                onChange={(e) =>
                                  setEditingEstimatedPomodoros(
                                    Math.max(1, Number(e.target.value)),
                                  )
                                }
                                min="1"
                                className="w-16 text-center border-t border-b border-gray-300 focus:ring-2 focus:ring-[#5f341f] rounded-none"
                                required
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingEstimatedPomodoros(
                                    editingEstimatedPomodoros + 1,
                                  )
                                }
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition"
                                aria-label="Increase Pomodoros"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Optional Fields */}
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            disabled
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
                          >
                            + Add Note
                          </button>
                          <button
                            type="button"
                            disabled
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
                          >
                            + Add Project
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to delete this task?',
                                )
                              ) {
                                handleDeleteTask(task._id);
                                cancelEditTask();
                              }
                            }}
                            className="flex-1 mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditTask}
                            className="flex-1 mx-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEditedTask(task._id)}
                            className="flex-1 ml-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                          >
                            Save
                          </button>
                        </div>

                        {/* Form Validation Error */}
                        {error && <p className="text-red-500">{error}</p>}
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          {/* Checkbox to mark as completed */}
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => {
                              // Toggle the status between 'completed' and 'pending'
                              setTasks((prevTasks) =>
                                prevTasks.map((t) =>
                                  t._id === task._id
                                    ? {
                                        ...t,
                                        status:
                                          t.status === 'completed'
                                            ? 'pending'
                                            : 'completed',
                                      }
                                    : t,
                                ),
                              );
                            }}
                            className="form-checkbox h-5 w-5 text-red-600"
                            onClick={(e) => e.stopPropagation()} // Prevent triggering task selection
                          />
                          {/* Task Title and Description */}
                          <div>
                            <p
                              className={`font-bold text-lg ${
                                task.status === 'completed'
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-800'
                              }`} // Strike-through if completed
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-gray-600">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {/* Pomodoro Counter */}
                          <span className="text-sm font-semibold text-[#5f341f]">
                            {task.pomodorosCompleted}/{task.estimatedTime}
                          </span>
                          {/* Options Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 bg-white shadow-md rounded-md hover:bg-gray-100 transition">
                                <IoMdMore className="h-5 w-5 text-gray-700" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onSelect={() => initiateEditTask(task)}
                                >
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => handleDeleteTask(task._id)}
                                >
                                  <Trash className="mr-2" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 p-4 bg-white shadow-md rounded-md max-w-md w-full">
            <p className="text-gray-700">
              <span className="font-semibold text-[#5f341f]">Pomos:</span>{' '}
              {totalPomodorosCompleted}/{totalPomodorosPlanned}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-[#5f341f]">
                Estimated Finish Time:
              </span>{' '}
              {calculateCompletionTimeWithRemaining()}
            </p>
          </div>

          {/* Spotify Iframe */}
          <div className="absolute h-[152px] bottom-4 right-4 animate-fadeIn">
            <iframe
              src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0"
              width="100%"
              height={152}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Add Task Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 animate-slideIn">
              <h2 className="text-2xl font-semibold mb-4 text-[#5f341f]">
                Select a Task
              </h2>
              <ul className="space-y-2 max-h-60 overflow-auto">
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                    onClick={() => handleAddTaskFromModal(task)}
                  >
                    <input
                      type="radio"
                      name="selectedTask"
                      checked={selectedTask?._id === task._id}
                      readOnly
                      className="form-radio h-5 w-5 text-[#5f341f]"
                    />
                    <span className="text-gray-800">{task.title}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={closeAddTaskModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Optionally, you can handle save here
                    closeAddTaskModal();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
