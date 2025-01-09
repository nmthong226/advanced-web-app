// src/components/Timer.tsx

import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
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
import { FaRegChartBar, FaCheck } from 'react-icons/fa';
import { Task } from './tasks';
import { Howl } from 'howler';
import { useTaskContext } from 'src/contexts/UserTaskContext.tsx';
import { useUser, useAuth } from '@clerk/clerk-react';
import { deleteTaskApi, updateTaskApi, addTaskApi } from './tasksApi';
import {
  createSessionSettings,
  updateSessionSettings,
  getAllSessionSettings,
  createCurrentPomodoro,
  updateCurrentPomodoro,
  createPomodoroLog,
  getAllPomodoroLogs,
} from './focusSessionsApi';
import { SessionSettings, CurrentPomodoro, PomodoroLog } from './types';
import { useNavigate } from 'react-router-dom';

// Function to handle mode title
const handleModeTitle = (
  mode: 'pomodoro' | 'short-break' | 'long-break',
): string => {
  switch (mode) {
    case 'pomodoro':
      return 'Time to Focus!';
    case 'short-break':
      return 'Short Break';
    case 'long-break':
      return 'Long Break';
    default:
      return 'Time to Focus!';
  }
};

const Timer = () => {
  const { getToken } = useAuth(); // Obtain the getToken function
  const { isSignedIn, user } = useUser(); // Ensure user is obtained

  // Settings State
  const [pomodoroDuration, setPomodoroDuration] = useState<number | null>(null); // in minutes
  const [shortBreakDuration, setShortBreakDuration] = useState<number | null>(
    null,
  ); // in minutes
  const [longBreakDuration, setLongBreakDuration] = useState<number | null>(
    null,
  ); // in minutes
  const [longBreakInterval, setLongBreakInterval] = useState<number | null>(
    null,
  ); // number of Pomodoros before a long break
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sound Settings
  const [soundAlarm, setSoundAlarm] = useState<string>('bell');
  const [soundBreak, setSoundBreak] = useState<string>('bird');

  // Timer States
  const [mode, setMode] = useState<'pomodoro' | 'short-break' | 'long-break'>(
    'pomodoro',
  );
  const [time, setTime] = useState<number | null>(null); // in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);

  // Task States from Context
  const { tasks, setTasks, addTask, deleteTask, editTask } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Edit Task Inline States
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
  const [editingPomodoroRequiredNumber, setEditingPomodoroRequiredNumber] =
    useState<number>(1);
  const [editingEstimatedTime, setEditingEstimatedTime] = useState<number>(25); // in minutes

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isTaskSelectModalOpen, setIsTaskSelectModalOpen] =
    useState<boolean>(false);

  // Focus Mode State
  const [isFocusModeOn, setIsFocusModeOn] = useState<boolean>(false);

  // Overlay State
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);

  // Form Error State
  const [error, setError] = useState<string | null>(null);

  // Session Settings and Current Pomodoro State
  const [sessionSettings, setSessionSettings] =
    useState<SessionSettings | null>(null);
  const [currentPomodoro, setCurrentPomodoro] =
    useState<CurrentPomodoro | null>(null);

  const navigate = useNavigate(); // React Router's useNavigate hook

  // Token State
  const [token, setToken] = useState<string>('');

  // Lock Screen Overlay Ref for Focus Management
  const lockScreenRef = useRef<HTMLDivElement>(null);

  // Function to set time based on current mode
  const setTimerTime = (
    currentMode: 'pomodoro' | 'short-break' | 'long-break',
  ) => {
    if (!sessionSettings) return;
    switch (currentMode) {
      case 'pomodoro':
        setTime(sessionSettings.default_work_time * 60);
        break;
      case 'short-break':
        setTime(sessionSettings.default_break_time * 60);
        break;
      case 'long-break':
        setTime(sessionSettings.long_break_time * 60);
        break;
      default:
        setTime(sessionSettings.default_work_time * 60);
        break;
    }
  };

  // Fetch and set the token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = await getToken({ template: 'supabase' }); // Replace with your Clerk template name if applicable
        console.log('Fetched Token:', fetchedToken);
        if (fetchedToken) {
          setToken(fetchedToken);
        } else {
          navigate('/home'); // Redirect to /home if no token is found
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, [getToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && token) {
          const user_id = user.id; // Adjust based on your user object

          // Fetch all session settings
          const settings = await getAllSessionSettings(token);
          console.log('Fetched Settings:', settings);

          if (settings) {
            setSessionSettings(settings);
            setPomodoroDuration(settings.default_work_time);
            setShortBreakDuration(settings.default_break_time);
            setLongBreakDuration(settings.long_break_time);
            setLongBreakInterval(settings.cycles_per_set);
            setTimerTime(mode); // Set time based on current mode
          } else {
            // Create default settings
            const defaultSettings = await createSessionSettings(
              {
                user_id,
                default_work_time: 25,
                default_break_time: 5,
                long_break_time: 15,
                cycles_per_set: 4,
              },
              token,
            );
            setSessionSettings(defaultSettings);
            setPomodoroDuration(defaultSettings.default_work_time);
            setShortBreakDuration(defaultSettings.default_break_time);
            setLongBreakDuration(defaultSettings.long_break_time);
            setLongBreakInterval(defaultSettings.cycles_per_set);
            setTimerTime(mode); // Set time based on current mode
          }

          // Fetch current pomodoro
          const currentPomodoroLogs = await getAllPomodoroLogs(token);
          const userCurrentPomodoro = currentPomodoroLogs.find(
            (log: PomodoroLog) => log.user_id === user_id,
          );
          if (userCurrentPomodoro) {
            setCurrentPomodoro(userCurrentPomodoro);
            setMode(userCurrentPomodoro.session_status);
            setTimerTime(userCurrentPomodoro.session_status);
          } else {
            // Create a new current pomodoro
            const newCurrentPomodoro = await createCurrentPomodoro(
              {
                user_id,
                current_pomodoro_number: 0,
                current_cycle_number: 0,
                session_status: 'pomodoro',
              },
              token,
            );
            setCurrentPomodoro(newCurrentPomodoro);
            setMode('pomodoro');
            setTimerTime('pomodoro');
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, [user, token]); // Removed 'mode' from dependencies

  // Update timer time when settings change and no task is selected
  useEffect(() => {
    if (!selectedTask && sessionSettings) {
      setTimerTime(mode);
    }
    // If a task is selected, keep the current timer running
  }, [
    pomodoroDuration,
    shortBreakDuration,
    longBreakDuration,
    mode,
    selectedTask,
    sessionSettings,
  ]);

  // Function to handle settings update
  const handleSettingsUpdate = async (updatedSettings: {
    default_work_time: number;
    default_break_time: number;
    long_break_time: number;
    cycles_per_set: number;
  }) => {
    if (!token) {
      console.error('No token available for updating settings.');
      return;
    }

    try {
      const user_id = user?.id;
      if (!user_id) throw new Error('User not authenticated');

      const updatedSessionSettings = await updateSessionSettings(
        user_id,
        {
          default_work_time: updatedSettings.default_work_time,
          default_break_time: updatedSettings.default_break_time,
          long_break_time: updatedSettings.long_break_time,
          cycles_per_set: updatedSettings.cycles_per_set,
        },
        token,
      );

      // Update local states
      setSessionSettings(updatedSessionSettings);
      setPomodoroDuration(updatedSessionSettings.default_work_time);
      setShortBreakDuration(updatedSessionSettings.default_break_time);
      setLongBreakDuration(updatedSessionSettings.long_break_time);
      setLongBreakInterval(updatedSessionSettings.cycles_per_set);

      // Update timer with slight delay
      setTimeout(() => {
        console.log('[DEBUG] Timer updated after settings update.');
      }, 100);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  // Function to handle background color based on the mode
  const getBackgroundColor = () => {
    switch (mode) {
      case 'short-break':
        return 'bg-[#368356]/10 transition-colors duration-500';
      case 'long-break':
        return 'bg-blue-100 transition-colors duration-500';
      default:
        return 'bg-red-100 transition-colors duration-500';
    }
  };

  // Function to open Task Selection Modal
  const openTaskSelectModal = () => {
    setIsTaskSelectModalOpen(true);
  };

  // Function to close Task Selection Modal
  const closeTaskSelectModal = () => {
    setIsTaskSelectModalOpen(false);
  };

  // Function to handle task selection
  const handleTaskSelect = async (task: Task) => {
    try {
      if (!user) throw new Error('User not authenticated');
      const user_id = user.id;

      // Update the task in the backend
      const updatedTask = await updateTaskApi(task._id, {
        is_on_pomodoro_list: true,
        status: 'in-progress', // Optionally update the status as well
      });

      // Update the task locally
      editTask(updatedTask);

      // Set as the selected task
      setSelectedTask(updatedTask);
      setTimerTime(mode); // Reset timer for the new task
      closeTaskSelectModal(); // Close the modal
    } catch (error) {
      console.error('Failed to update the task in the backend:', error);
    }
  };

  const startButtonColor = () => {
    switch (mode) {
      case 'short-break':
        return 'bg-[#368356]/70';
      case 'long-break':
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
    currentMode: 'pomodoro' | 'short-break' | 'long-break',
  ): number => {
    if (!sessionSettings) return 0;
    switch (currentMode) {
      case 'pomodoro':
        return sessionSettings.default_work_time * 60; // Convert minutes to seconds
      case 'short-break':
        return sessionSettings.default_break_time * 60;
      case 'long-break':
        return sessionSettings.long_break_time * 60;
      default:
        return sessionSettings.default_work_time * 60;
    }
  };

  // Function to handle mode change
  const handleModeChange = (
    newMode: 'pomodoro' | 'short-break' | 'long-break',
  ) => {
    setMode(newMode);
    setIsActive(false); // Pause timer
    setIsOverlayActive(false); // Disable overlay when mode changes
    setTimerTime(newMode); // Reset time based on new mode
  };

  // Function to play alarm sound
  const playAlarmSoundFunction = () => {
    let soundUrl = '';
    if (soundAlarm === 'bell') {
      soundUrl =
        'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fbell.MP3?alt=media&token=bfd3eaa1-235e-4dea-948b-87610db24f1e';
    } else if (soundAlarm === 'kitchen') {
      soundUrl =
        'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fchime.MP3?alt=media&token=9f9c0d0a-2b0b-4e9a-8f9f-4d6c0d9d5f8d';
    }

    if (soundUrl) {
      const soundInstance = new Howl({
        src: [soundUrl],
        html5: true,
      });
      soundInstance.play();
    }
  };

  // Function to play break sound
  const playBreakSoundFunction = () => {
    let soundUrl = '';
    if (soundBreak === 'bird') {
      soundUrl =
        'https://firebasestorage.googleapis.com/v0/b/yolo-web-app.appspot.com/o/music%2Fbreak.MP3?alt=media&token=210cff3d-b006-4947-b290-9bb5efbd3336';
    }

    if (soundUrl) {
      const soundInstance = new Howl({
        src: [soundUrl],
        html5: true,
      });
      soundInstance.play();
    }
  };

  // Function to handle Pomodoro Completion
  const handlePomodoroCompletion = async () => {
    if (!selectedTask) return;

    const user_id = user?.id; // Get authenticated user's ID
    if (!user_id) {
      console.error('User not authenticated');
      return;
    }

    // Define start_time and end_time
    const end_time = new Date().toISOString();
    const start_time = new Date(
      Date.now() - getDefaultTime(mode) * 1000,
    ).toISOString(); // Adjust as needed

    // Prepare log data
    const logData: PomodoroLog = {
      user_id,
      task_id: selectedTask._id,
      current_pomodoro_number: currentPomodoro?.current_pomodoro_number || 0,
      current_cycle_number: currentPomodoro?.current_cycle_number || 0,
      required_cycle_number: selectedTask.pomodoro_required_number,
      start_time,
      end_time,
      session_status: 'pomodoro', // Assuming it's a pomodoro completion
    };

    try {
      // Update Current Pomodoro First
      let newSessionStatus: 'pomodoro' | 'short-break' | 'long-break' =
        'pomodoro';
      let newPomodoroNumber = currentPomodoro?.current_pomodoro_number || 0;
      let newCycleNumber = currentPomodoro?.current_cycle_number || 0;

      if (mode === 'pomodoro') {
        newPomodoroNumber += 1;
        if (newPomodoroNumber >= (sessionSettings?.cycles_per_set || 4)) {
          newSessionStatus = 'long-break';
          newPomodoroNumber = 0; // Reset based on cycles
          newCycleNumber += 1;
        } else {
          newSessionStatus = 'short-break';
        }
      } else if (mode === 'short-break') {
        newSessionStatus = 'pomodoro';
      } else if (mode === 'long-break') {
        newSessionStatus = 'pomodoro';
        newCycleNumber = 0;
      }

      const updatedCurrentPomodoro: CurrentPomodoro = {
        user_id,
        current_pomodoro_number: newPomodoroNumber,
        current_cycle_number: newCycleNumber,
        session_status: newSessionStatus,
      };

      // Update CurrentPomodoro in the backend
      await updateCurrentPomodoro(updatedCurrentPomodoro, user_id, token);
      setCurrentPomodoro(updatedCurrentPomodoro);
      console.log('Updated Current Pomodoro:', updatedCurrentPomodoro);

      // Update the task in the backend
      const updatedTask = await updateTaskApi(selectedTask._id, {
        pomodoro_number: selectedTask.pomodoro_number + 1,
      });

      // Update the task in the context
      editTask(updatedTask);
      console.log('Updated Task:', updatedTask);

      // Check if the task is completed
      if (updatedTask.pomodoro_number >= updatedTask.pomodoro_required_number) {
        // Update the task's status to 'completed'
        const completedTask = await updateTaskApi(selectedTask._id, {
          status: 'completed',
        });
        editTask(completedTask);
        console.log('Task Completed:', completedTask);

        // Remove the task from the Pomodoro list
        setSelectedTask(null);
      } else {
        // Update the selectedTask state to reflect the new pomodoro_number
        setSelectedTask(updatedTask);
        console.log('Selected Task Updated:', updatedTask);
      }

      // Then create Pomodoro Log
      await createPomodoroLog(logData, token);
      console.log('Pomodoro Log Created:', logData);

      // Update frontend states
      setPomodoroCount((prevCount) => prevCount + 1);

      if (newSessionStatus === 'pomodoro') {
        setMode('pomodoro');
        setTimerTime('pomodoro');
        setSelectedTask(null);
      } else {
        setMode(newSessionStatus);
        setTimerTime(newSessionStatus);
      }

      // Play appropriate sound
      if (newSessionStatus === 'pomodoro') {
        playAlarmSoundFunction();
      } else {
        playBreakSoundFunction();
      }

      // Activate Overlay if Focus Mode is ON and new session is Pomodoro
      if (isFocusModeOn && newSessionStatus === 'pomodoro') {
        setIsOverlayActive(true);
      }
    } catch (error) {
      console.error('Failed to log Pomodoro session:', error);
      // Optionally, set error state to display to the user
    }
  };

  // Timer effect
  useEffect(() => {
    if (isLoading || time === null) return;

    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => (prevTime !== null ? prevTime - 1 : null));
      }, 1000);
    } else if (isActive && time === 0) {
      setIsActive(false); // Stop timer
      if (selectedTask) {
        handlePomodoroCompletion(); // Update completed Pomodoros for the task
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, selectedTask, isFocusModeOn, mode]);

  // Update document title with time and mode
  useEffect(() => {
    if (time !== null) {
      document.title = `${formatTime(time)} - ${handleModeTitle(mode)}`;
    } else {
      document.title = 'Pomofocus';
    }
  }, [time, mode]);

  // Prevent scrolling when overlay or modals are active
  useEffect(() => {
    if (isAddModalOpen || isTaskSelectModalOpen || isOverlayActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddModalOpen, isTaskSelectModalOpen, isOverlayActive]);

  // Function to handle delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const updatedTask = await updateTaskApi(taskId, {
        is_on_pomodoro_list: false,
      });

      // Update the task in the local state
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task._id === taskId ? { ...task, is_on_pomodoro_list: false } : task,
        );
        console.log('Updated Tasks:', updatedTasks);
        return updatedTasks;
      });

      setIsActive(false);
      setSelectedTask(null);
      setTime(getDefaultTime(mode));

      console.log(`Task with ID ${taskId} deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete the task:', error);
      // Optionally, set error state to display to the user
    }
  };

  // Function to handle selecting a task
  const handleSelectTask = (task: Task) => {
    if (!isSignedIn) return; // Prevent selection if not signed in

    if (task.status === 'completed') return; // Do not allow selecting completed tasks

    if (isActive && selectedTask && selectedTask._id !== task._id) {
      // If a different task is already active, confirm switch
      if (
        window.confirm(
          'A timer is already running for another task. Do you want to switch to this task? The current timer will be paused.',
        )
      ) {
        setIsActive(false);
        setIsOverlayActive(false); // Disable overlay when switching
        setSelectedTask(task);
        setTimerTime(mode);
        // Update the newly selected task's status to 'in-progress'
        editTask({ ...task, status: 'in-progress' });
      }
    } else {
      setSelectedTask(task);
      setTimerTime(mode);
      // Update task status to 'in-progress' upon selection
      editTask({ ...task, status: 'in-progress' });
    }
  };

  // Function to handle Pomodoro Skipping
  const handleSkip = async () => {
    if (!selectedTask) {
      alert('Please select a task to skip Pomodoro.');
      return;
    }

    const user_id = user?.id;
    if (!user_id) {
      console.error('User not authenticated');
      return;
    }

    try {
      if (mode === 'pomodoro') {
        // Increment pomodoroNumber in the backend
        const updatedTask = await updateTaskApi(selectedTask._id, {
          pomodoro_number: selectedTask.pomodoro_number + 1,
        });

        // Update the task in the context
        editTask(updatedTask);
        console.log('Updated Task:', updatedTask);
        setPomodoroCount((prevCount) => prevCount + 1);

        // Check if the task is completed
        if (
          updatedTask.pomodoro_number >= updatedTask.pomodoro_required_number
        ) {
          // Update the task's status to 'completed'
          const completedTask = await updateTaskApi(selectedTask._id, {
            status: 'completed',
          });
          editTask(completedTask);
          console.log('Task Completed:', completedTask);

          // Remove the task from the Pomodoro list
          setSelectedTask(null);
        } else {
          // Update the selectedTask state to reflect the new pomodoro_number
          setSelectedTask(updatedTask);
          console.log('Selected Task Updated:', updatedTask);
        }

        // Update Current Pomodoro first
        let newSessionStatus: 'pomodoro' | 'short-break' | 'long-break' =
          'pomodoro';
        let newPomodoroNumber = currentPomodoro?.current_pomodoro_number || 0;
        let newCycleNumber = currentPomodoro?.current_cycle_number || 0;

        newPomodoroNumber += 1;
        if (newPomodoroNumber >= (sessionSettings?.cycles_per_set || 4)) {
          newSessionStatus = 'long-break';
          newPomodoroNumber = 0; // Reset based on cycles
          newCycleNumber += 1;
        } else {
          newSessionStatus = 'short-break';
        }

        const updatedCurrentPomodoro: CurrentPomodoro = {
          user_id,
          current_pomodoro_number: newPomodoroNumber,
          current_cycle_number: newCycleNumber,
          session_status: newSessionStatus,
        };

        // Update CurrentPomodoro in the backend
        await updateCurrentPomodoro(updatedCurrentPomodoro, user_id, token);
        setCurrentPomodoro(updatedCurrentPomodoro);
        console.log('Updated Current Pomodoro:', updatedCurrentPomodoro);

        // Log the skipped Pomodoro
        const logData: PomodoroLog = {
          user_id,
          task_id: selectedTask._id,
          current_pomodoro_number: newPomodoroNumber,
          current_cycle_number: newCycleNumber,
          required_cycle_number: selectedTask.pomodoro_required_number,
          start_time: new Date().toISOString(), // Adjust as needed
          end_time: new Date().toISOString(), // Adjust as needed
          session_status: 'pomodoro',
        };
        await createPomodoroLog(logData, token);
        console.log('Pomodoro Log Created:', logData);

        // Set timer and mode based on new session status
        if (newSessionStatus === 'pomodoro') {
          setMode('pomodoro');
          setTimerTime('pomodoro');
          setSelectedTask(null); // Optionally deselect the task
        } else {
          setMode(newSessionStatus);
          setTimerTime(newSessionStatus);
        }

        // Play appropriate sound
        if (newSessionStatus === 'pomodoro') {
          playAlarmSoundFunction();
        } else {
          playBreakSoundFunction();
        }

        // Activate Overlay only if Focus Mode is ON and new session is Pomodoro
        if (isFocusModeOn && newSessionStatus === 'pomodoro') {
          setIsOverlayActive(true);
        }
      } else if (mode === 'short-break' || mode === 'long-break') {
        // Transition back to Pomodoro mode
        handleModeChange('pomodoro');
      }

      setIsActive(false); // Stop the timer
      setIsOverlayActive(false); // Disable overlay when timer is stopped
    } catch (error) {
      console.error('Failed to skip Pomodoro:', error);
      // Optionally, set error state to display to the user
    }
  };

  // Function to initiate editing a task
  const initiateEditTask = (task: Task) => {
    setEditingTaskId(task._id);
    setEditingTaskTitle(task.title);
    setEditingPomodoroRequiredNumber(task.pomodoro_required_number);
    setEditingEstimatedTime(task.estimatedTime || 25);
    setError(null);
  };

  // Function to save edited task
  const saveEditedTask = async (taskId: string) => {
    if (!editingTaskTitle.trim()) {
      setError('Task title is required.');
      return;
    }

    if (editingPomodoroRequiredNumber < 1) {
      setError('Pomodoros required must be at least 1.');
      return;
    }

    try {
      // Call the API to update the task
      const updatedTask = await updateTaskApi(taskId, {
        title: editingTaskTitle,
        pomodoro_required_number: editingPomodoroRequiredNumber,
      });

      // Update the task locally
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task,
        ),
      );

      // Update the selected task if it's being edited
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask((prevSelected) =>
          prevSelected ? { ...prevSelected, ...updatedTask } : null,
        );
      }

      setEditingTaskId(null);
      setError(null);
      console.log('Task updated successfully:', updatedTask);
    } catch (error) {
      console.error('Failed to update the task:', error);
      // Optionally, set error state to display to the user
    }
  };

  // Function to cancel editing a task
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

  // Function to handle adding a new task from the modal
  const handleAddTaskFromModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      // Unauthenticated users cannot select tasks
      const newTask: Task = {
        _id: Date.now().toString(), // Simple unique ID
        title: editingTaskTitle,
        description: '', // Optional
        pomodoro_number: 0,
        pomodoro_required_number: editingPomodoroRequiredNumber,
        estimatedTime: editingEstimatedTime,
        status: 'pending',
        userId: '',
        priority: 'low',
        category: '',
        is_on_pomodoro_list: false,
      };
      addTask(newTask);
      setEditingTaskTitle('');
      setEditingPomodoroRequiredNumber(1);
      setEditingEstimatedTime(25);
      setIsAddModalOpen(false);
    } else {
      try {
        const user_id = user?.id;
        if (!user_id) throw new Error('User not authenticated');

        // Call the API to add the task
        const createdTask = await addTaskApi({
          title: editingTaskTitle,
          pomodoro_required_number: editingPomodoroRequiredNumber,
          estimatedTime: editingEstimatedTime,
          is_on_pomodoro_list: false,
          userId: user_id,
          status: 'pending',
          priority: 'low',
          category: '',
        });

        // Update the task locally
        addTask(createdTask);

        setSelectedTask(createdTask);
        setTimerTime(mode);
        setIsAddModalOpen(false);
      } catch (error) {
        console.error('Failed to add task:', error);
        // Optionally, set error state to display to the user
      }
    }
  };

  // Total Pomodoros and Estimated Time
  const totalPomodorosPlanned = tasks
    .filter((task) => task.is_on_pomodoro_list)
    .reduce((acc, task) => acc + task.pomodoro_required_number, 0);

  const totalPomodorosCompleted = tasks
    .filter((task) => task.is_on_pomodoro_list)
    .reduce((acc, task) => acc + task.pomodoro_number, 0);

  const totalEstimatedTime = tasks
    .filter((task) => task.is_on_pomodoro_list)
    .reduce((acc, task) => acc + (task.estimatedTime || 0), 0);

  // Calculate estimated finish time based on selected task and Pomodoros
  const calculateCompletionTimeWithRemaining = (): string => {
    let totalSeconds = 0;

    tasks
      .filter((task) => task.is_on_pomodoro_list)
      .forEach((task) => {
        const remainingPomos =
          task.pomodoro_required_number - task.pomodoro_number;
        if (remainingPomos <= 0) return; // Skip completed tasks

        const fullCycles = Math.floor(
          remainingPomos / (sessionSettings?.cycles_per_set || 4),
        ); // Full cycles based on longBreakInterval
        const leftoverPomos =
          remainingPomos % (sessionSettings?.cycles_per_set || 4); // Remaining Pomodoros

        // Full cycle time
        totalSeconds +=
          fullCycles *
          ((sessionSettings?.default_work_time || 25) *
            60 *
            (sessionSettings?.cycles_per_set || 4) +
            (sessionSettings?.long_break_time || 15) * 60); // Pomodoros + Long Breaks

        // Remaining Pomodoro time
        totalSeconds +=
          leftoverPomos * (sessionSettings?.default_work_time || 25) * 60; // Pomodoro durations
        totalSeconds +=
          (leftoverPomos > 0 ? leftoverPomos - 1 : 0) *
          (sessionSettings?.default_break_time || 5) *
          60; // Short breaks
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

  // Function to toggle the timer (Start/Pause)
  const toggleTimer = async () => {
    if (isActive) {
      // Pausing the timer
      setIsActive(false);
      setIsOverlayActive(false); // Disable overlay when paused
    } else {
      if (selectedTask || !isSignedIn) {
        setIsActive(true);
        if (mode === 'pomodoro' && isFocusModeOn) {
          setIsOverlayActive(true); // Activate overlay only if Focus Mode is ON
        } else {
          setIsOverlayActive(false); // Do not activate overlay otherwise
        }
        if (selectedTask) {
          // Update current pomodoro to 'pomodoro' when starting
          const user_id = user?.id;
          if (user_id && token && currentPomodoro) {
            const updatedCurrentPomodoro: CurrentPomodoro = {
              ...currentPomodoro,
              session_status: 'pomodoro',
            };

            try {
              await updateCurrentPomodoro(
                updatedCurrentPomodoro,
                user_id,
                token,
              );
              setCurrentPomodoro(updatedCurrentPomodoro);
            } catch (error) {
              console.error('Failed to update current pomodoro:', error);
            }
          }
        }
      } else {
        alert('Please select a task to start the timer.');
      }
    }
  };

  // Function to toggle Focus Mode
  const toggleFocusMode = () => {
    setIsFocusModeOn((prev) => !prev);
    // Optionally, you can decide whether to pause the timer when toggling Focus Mode off
    if (isFocusModeOn && isActive) {
      setIsActive(false);
      setIsOverlayActive(false);
    }
  };

  return (
    <div className="flex md:flex-row flex-col bg-indigo-50 p-2">
      {/* Main Content Wrapper */}
      <div
        className={`flex flex-col w-full min-h-screen ${getBackgroundColor()} relative h-full rounded-lg border`}
      >
        {/* Header */}
        <div className="flex sm:flex-row flex-col justify-center items-center bg-white px-4 py-3 rounded-t-lg w-full">
          <div className="flex justify-between items-center mx-auto w-full max-w-2xl">
            <div className="flex justify-center items-center mb-4 sm:mb-0 font-bold text-lg text-zinc-700">
              <GiTomato className="mr-2" />
              <p>Pomofocus</p>
            </div>
            <div className="flex space-x-2">
              <PomoSettings
                pomodoroDuration={pomodoroDuration}
                setPomodoroDuration={setPomodoroDuration}
                shortBreakDuration={shortBreakDuration}
                setShortBreakDuration={setShortBreakDuration}
                longBreakDuration={longBreakDuration}
                setLongBreakDuration={setLongBreakDuration}
                longBreakInterval={longBreakInterval}
                setLongBreakInterval={setLongBreakInterval}
                soundAlarm={soundAlarm}
                setSoundAlarm={setSoundAlarm}
                soundBreak={soundBreak}
                setSoundBreak={setSoundBreak}
                onUpdateSettings={handleSettingsUpdate} // Add this prop
              />{' '}
              {/* Settings Button */}
              {/* Focus Mode Toggle Button */}
              <button
                onClick={toggleFocusMode}
                className={`flex items-center rounded-md p-2 px-4 border shadow-md text-zinc-700 font-semibold hover:bg-gray-100 transition ${
                  isFocusModeOn ? 'bg-green-600 text-white' : 'bg-white'
                }`}
              >
                {isFocusModeOn ? 'Focus Mode ON' : 'Focus Mode OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-center mt-10 px-4 w-full">
          <div className="relative flex flex-col justify-between items-center bg-white shadow-md p-6 rounded-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl h-auto">
            {/* Mode Selection */}
            <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-6">
              <button
                onClick={() => handleModeChange('pomodoro')}
                className={`p-2 px-4 rounded-md font-bold ${
                  mode === 'pomodoro'
                    ? 'bg-red-600 text-white'
                    : 'text-[#5f341f] hover:bg-red-100'
                } transition-colors text-sm sm:text-base`}
              >
                Pomodoro
              </button>
              <button
                onClick={() => handleModeChange('short-break')}
                className={`p-2 px-4 rounded-md font-bold ${
                  mode === 'short-break'
                    ? 'bg-[#368356] text-white'
                    : 'text-[#5f341f] hover:bg-green-100'
                } transition-colors text-sm sm:text-base`}
              >
                Short Break
              </button>
              <button
                onClick={() => handleModeChange('long-break')}
                className={`p-2 px-4 rounded-md font-bold ${
                  mode === 'long-break'
                    ? 'bg-blue-600 text-white'
                    : 'text-[#5f341f] hover:bg-blue-100'
                } transition-colors text-sm sm:text-base`}
              >
                Long Break
              </button>
            </div>

            {/* Timer Display */}
            <div className="flex justify-center mb-6">
              {isLoading || time === null ? (
                <p className="font-semibold text-4xl text-gray-400 sm:text-5xl md:text-6xl">
                  Loading...
                </p>
              ) : (
                <p className="font-semibold text-[#5f341f] text-6xl sm:text-7xl md:text-8xl">
                  {formatTime(time)}
                </p>
              )}
            </div>

            {/* Start/Pause and Skip Buttons */}
            <div className="relative flex justify-center items-center space-x-2 sm:space-x-4 w-full h-12">
              {/* Start/Pause Button */}
              <button
                onClick={toggleTimer}
                className={`flex-1 h-full p-2 rounded-md ${startButtonColor()} text-white text-lg font-semibold hover:brightness-90 transition`}
                disabled={isLoading || time === null}
              >
                <p>{isActive ? 'Pause' : 'Start'}</p>
              </button>

              {/* Skip Button (Visible Only When Active) */}
              {isActive && (
                <button
                  onClick={handleSkip}
                  className="flex flex-1 justify-center items-center bg-gray-300 hover:bg-gray-400 p-2 rounded-md h-full font-semibold text-gray-800 text-lg transition"
                  aria-label="Skip Pomodoro"
                >
                  <BsFillSkipEndFill className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mode Title and Selected Task */}
        <div className="flex flex-col justify-center items-center mt-6 px-4 w-full">
          {/* Dynamic Pomodoro Count Display */}
          <p className="font-bold text-[#5f341f] text-lg sm:text-xl">
            #{pomodoroCount}
          </p>
          <p className="text-[#5f341f] text-base sm:text-lg">
            {handleModeTitle(mode)}
          </p>

          {/* Selected Task Display (Only for Authenticated Users) */}
          {isSignedIn && selectedTask && (
            <div
              className={`mt-2 p-4 rounded-md w-full max-w-lg md:max-w-xl lg:max-w-2xl text-center transition-colors ${
                selectedTask.status === 'completed'
                  ? 'bg-green-100'
                  : 'bg-gray-200'
              }`}
            >
              <p className="font-semibold text-lg sm:text-xl">
                {selectedTask.title}
              </p>
              {selectedTask.status === 'completed' && (
                <p className="text-green-700 text-sm sm:text-base">
                  Completed!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="flex flex-col justify-center items-center space-y-5 mt-3 px-4 w-full">
          {/* Tasks Header */}
          <div className="flex sm:flex-row flex-col justify-between items-center border-gray-300 py-2 border-b-2 w-full max-w-xl lg:max-w-2xl">
            <p className="font-bold text-[#5f341f] text-lg sm:text-xl">Tasks</p>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {/* Add Task Button */}
              {isSignedIn ? (
                <button
                  onClick={openTaskSelectModal}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm text-white sm:text-base transition"
                >
                  Select Task
                </button>
              ) : (
                <button
                  onClick={openAddTaskModal}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm text-white sm:text-base transition"
                >
                  Add Task
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-white hover:bg-gray-100 shadow-md p-2 rounded-md transition">
                    <IoMdMore className="w-6 h-6 text-gray-700" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={async () => {
                        // Remove all tasks from Pomodoro list
                        if (
                          window.confirm(
                            'Are you sure you want to remove all tasks from the Pomodoro list?',
                          )
                        ) {
                          if (isSignedIn && token) {
                            try {
                              // Iterate through all tasks and update is_on_pomodoro_list to false
                              const updatePromises = tasks.map((task) =>
                                updateTaskApi(task._id, {
                                  is_on_pomodoro_list: false,
                                }),
                              );
                              await Promise.all(updatePromises);
                              setTasks([]);
                              setSelectedTask(null);
                              setIsActive(false);
                              setTimerTime(mode);
                            } catch (error) {
                              console.error(
                                'Failed to remove all tasks from Pomodoro list:',
                                error,
                              );
                            }
                          } else {
                            // Clear local tasks
                            setTasks([]);
                            setSelectedTask(null);
                            setIsActive(false);
                            setTimerTime(mode);
                          }
                        }
                      }}
                    >
                      <Trash className="mr-2" />
                      <span>Remove all tasks from Pomodoro</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={async () => {
                        // Remove finished tasks from Pomodoro list
                        if (
                          window.confirm(
                            'Are you sure you want to remove all completed tasks from the Pomodoro list?',
                          )
                        ) {
                          try {
                            if (isSignedIn && token) {
                              // Iterate through completed tasks and update is_on_pomodoro_list to false
                              const completedTasks = tasks.filter(
                                (task) => task.status === 'completed',
                              );
                              const updatePromises = completedTasks.map(
                                (task) =>
                                  updateTaskApi(task._id, {
                                    is_on_pomodoro_list: false,
                                  }),
                              );
                              await Promise.all(updatePromises);
                              setTasks((prevTasks) =>
                                prevTasks.filter(
                                  (task) => task.status !== 'completed',
                                ),
                              );
                            } else {
                              // Clear local completed tasks
                              setTasks((prevTasks) =>
                                prevTasks.filter(
                                  (task) => task.status !== 'completed',
                                ),
                              );
                            }
                          } catch (error) {
                            console.error(
                              'Failed to remove completed tasks from Pomodoro list:',
                              error,
                            );
                          }
                        }
                      }}
                    >
                      <Trash2 className="mr-2" />
                      <span>Remove completed tasks from Pomodoro</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Display Tasks */}
          <div className="flex flex-col mt-4 w-full max-w-xl lg:max-w-2xl">
            {tasks.length === 0 && (
              <p className="text-center text-gray-500">No tasks available.</p>
            )}
            {tasks.length > 0 && (
              <ul className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
                {tasks
                  .filter((task) => !isSignedIn || task.is_on_pomodoro_list) // Filter tasks if logged in
                  .map((task) => (
                    <li
                      key={task._id}
                      className={`flex flex-col p-4 bg-white shadow-md rounded-md cursor-pointer hover:bg-gray-50 transition-colors 
                                 ${
                                   isSignedIn &&
                                   selectedTask &&
                                   selectedTask._id === task._id
                                     ? 'border-2 border-blue-500'
                                     : ''
                                 }`}
                      onClick={() => handleSelectTask(task)} // Task selection
                    >
                      {editingTaskId === task._id ? (
                        // Edit Task Form
                        <div className="flex flex-col space-y-4">
                          {/* Task Title Input */}
                          <div>
                            <label className="font-bold">Task Title</label>
                            <input
                              type="text"
                              value={editingTaskTitle}
                              onChange={(e) =>
                                setEditingTaskTitle(e.target.value)
                              }
                              className="p-2 border rounded-md w-full"
                            />
                          </div>

                          {/* Pomodoro Counters */}
                          <div>
                            <label className="font-bold">
                              Pomodoros Required
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={editingPomodoroRequiredNumber}
                              onChange={(e) =>
                                setEditingPomodoroRequiredNumber(
                                  Number(e.target.value),
                                )
                              }
                              className="p-2 border rounded-md w-full"
                            />
                          </div>

                          {/* Estimated Time */}
                          <div>
                            <label className="font-bold">
                              Estimated Time (mins)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={editingEstimatedTime}
                              onChange={(e) =>
                                setEditingEstimatedTime(
                                  Math.max(1, Number(e.target.value)),
                                )
                              }
                              className="p-2 border rounded-md w-full"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={cancelEditTask}
                              className="bg-gray-300 px-4 py-2 rounded-md"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEditedTask(task._id)}
                              className="bg-blue-600 px-4 py-2 rounded-md text-white"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Task Display
                        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center">
                          <div className="flex items-center space-x-4">
                            {/* Checkbox to mark as completed */}
                            {isSignedIn && (
                              <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                onChange={async () => {
                                  if (task.status !== 'completed') {
                                    try {
                                      const updatedTask = await updateTaskApi(
                                        task._id,
                                        {
                                          status: 'completed',
                                          pomodoro_number:
                                            task.pomodoro_required_number,
                                        },
                                      );
                                      editTask(updatedTask);
                                      playAlarmSoundFunction();

                                      if (
                                        selectedTask &&
                                        selectedTask._id === task._id
                                      ) {
                                        setIsActive(false);
                                        setTimerTime(mode);
                                        setSelectedTask(null);
                                        setIsOverlayActive(false); // Disable overlay if task is completed
                                      }
                                    } catch (error) {
                                      console.error(
                                        'Failed to mark task as completed:',
                                        error,
                                      );
                                    }
                                  } else {
                                    try {
                                      const updatedTask = await updateTaskApi(
                                        task._id,
                                        {
                                          status: 'pending',
                                          pomodoro_number: 0,
                                        },
                                      );
                                      editTask(updatedTask);
                                    } catch (error) {
                                      console.error(
                                        'Failed to mark task as pending:',
                                        error,
                                      );
                                    }
                                  }
                                }}
                                className="form-checkbox w-5 h-5 text-red-600"
                                onClick={(e) => e.stopPropagation()} // Prevent triggering task selection
                              />
                            )}
                            {/* Task Title */}
                            <p
                              className={`font-bold text-lg ${
                                task.status === 'completed'
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-800'
                              }`} // Strike-through if completed
                            >
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                            {/* Pomodoro Counter */}
                            <span className="font-semibold text-[#5f341f] text-sm">
                              {task.pomodoro_number}/
                              {task.pomodoro_required_number}
                            </span>
                            {/* Options Dropdown */}
                            {isSignedIn && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="bg-white hover:bg-gray-100 shadow-md p-2 rounded-md transition">
                                    <IoMdMore className="w-5 h-5 text-gray-700" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      onSelect={() => initiateEditTask(task)} // Edit Task
                                    >
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        handleDeleteTask(task._id)
                                      } // Remove from Pomodoro List
                                    >
                                      <span>Remove from Pomodoro</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="bg-white shadow-md mt-4 p-4 rounded-md w-full max-w-xl lg:max-w-2xl">
            <p className="text-base text-gray-700 sm:text-lg">
              <span className="font-semibold text-[#5f341f]">Pomos:</span>{' '}
              {totalPomodorosCompleted}/{totalPomodorosPlanned}
            </p>
            <p className="text-base text-gray-700 sm:text-lg">
              <span className="font-semibold text-[#5f341f]">
                Estimated Finish Time:
              </span>{' '}
              {calculateCompletionTimeWithRemaining()}
            </p>
          </div>

          {/* Spotify Iframe */}
          <div className="mt-6 w-full max-w-xl lg:max-w-2xl">
            <div className="flex justify-center">
              <iframe
                src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0"
                width="100%"
                height={152}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-md"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Focus Mode Overlay */}
        {isOverlayActive && mode === 'pomodoro' && isActive && (
          <div
            className="z-50 fixed inset-0 flex justify-center items-end bg-black bg-opacity-50 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              ref={lockScreenRef}
              className="flex flex-col items-center space-y-4 bg-white shadow-lg mb-4 p-4 rounded-lg w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
              tabIndex={-1}
            >
              <GiTomato className="w-12 h-12 text-red-600" />
              <h2 className="font-bold text-gray-800 text-xl">
                Focus Mode Active
              </h2>
              <p className="text-gray-600">
                You are in a Pomodoro session. Stay focused!
              </p>
              <div className="flex space-x-3">
                {/* Pause Timer Button */}
                <button
                  onClick={() => setIsActive(false)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition"
                >
                  Pause Timer
                </button>
                {/* Skip Pomodoro Button */}
                <button
                  onClick={handleSkip}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-gray-700 transition"
                >
                  Skip Pomodoro
                </button>
                {/* Exit Focus Mode Button */}
                <button
                  onClick={toggleFocusMode}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition"
                >
                  Exit Focus Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Selection Modal */}
        {isTaskSelectModalOpen && isSignedIn && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white shadow-lg p-6 rounded-lg w-11/12 sm:w-96">
              <h2 className="mb-4 font-bold text-xl">Select a Task</h2>
              {tasks.filter(
                (task) =>
                  !task.is_on_pomodoro_list && task.status !== 'completed',
              ).length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {tasks
                    .filter(
                      (task) =>
                        !task.is_on_pomodoro_list &&
                        task.status !== 'completed',
                    )
                    .map((task) => (
                      <li
                        key={task._id}
                        className="bg-gray-100 hover:bg-gray-200 shadow p-4 rounded-md transition cursor-pointer"
                        onClick={() => handleTaskSelect(task)}
                      >
                        <p className="font-semibold text-base sm:text-lg">
                          {task.title}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {task.pomodoro_number}/{task.pomodoro_required_number}{' '}
                          Pomodoros
                        </p>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No tasks available for selection.
                </p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeTaskSelectModal}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-gray-700 text-sm sm:text-base transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {isAddModalOpen && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white shadow-lg p-6 rounded-lg w-11/12 sm:w-96">
              <h2 className="mb-4 font-semibold text-[#5f341f] text-2xl">
                Add New Task
              </h2>
              <form onSubmit={handleAddTaskFromModal} className="space-y-4">
                {/* Task Title */}
                <div>
                  <Label htmlFor="new-task-title" className="mb-1 font-bold">
                    Task Title
                  </Label>
                  <Input
                    id="new-task-title"
                    type="text"
                    value={editingTaskTitle}
                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                    className="bg-white shadow-inner rounded-md w-full placeholder-gray-400"
                    required
                  />
                </div>

                {/* Pomodoro Required */}
                <div>
                  <Label htmlFor="new-task-pomos" className="mb-1 font-bold">
                    Pomodoros Required
                  </Label>
                  <Input
                    id="new-task-pomos"
                    type="number"
                    value={editingPomodoroRequiredNumber}
                    onChange={(e) =>
                      setEditingPomodoroRequiredNumber(
                        Math.max(1, Number(e.target.value)),
                      )
                    }
                    min="1"
                    className="border-gray-300 border-t border-b rounded-md focus:ring-2 focus:ring-[#5f341f] w-full text-center"
                    required
                  />
                </div>

                {/* Estimated Time */}
                <div>
                  <Label htmlFor="new-task-time" className="mb-1 font-bold">
                    Estimated Time (mins)
                  </Label>
                  <Input
                    id="new-task-time"
                    type="number"
                    value={editingEstimatedTime}
                    onChange={(e) =>
                      setEditingEstimatedTime(
                        Math.max(1, Number(e.target.value)),
                      )
                    }
                    min="1"
                    className="border-gray-300 border-t border-b rounded-md focus:ring-2 focus:ring-[#5f341f] w-full text-center"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingTaskTitle('');
                      setEditingPomodoroRequiredNumber(1);
                      setEditingEstimatedTime(25);
                      setError(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-gray-700 text-sm sm:text-base transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm text-white sm:text-base transition"
                  >
                    Add Task
                  </button>
                </div>

                {/* Form Validation Error */}
                {error && (
                  <p className="text-red-500 text-sm sm:text-base">{error}</p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
