// src/components/Timer.tsx

import { useEffect, useState } from 'react';
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
import { Task } from './tasks'; // Import Task
import { Howl } from 'howler'; // Ensure you have howler installed
import { useTaskContext } from 'src/contexts/UserTaskContext.tsx';
import { useUser, useAuth } from '@clerk/clerk-react'; // Added useAuth
import { deleteTaskApi, updateTaskApi, addTaskApi } from './tasksApi'; // Adjust the path as necessary
import {
  createSessionSettings,
  updateSessionSettings,
  getAllSessionSettings,
  createCurrentPomodoro,
  updateCurrentPomodoro,
  createPomodoroLog,
  getAllPomodoroLogs,
} from './focusSessionsApi'; // Adjust the path as necessary
import { SessionSettings, CurrentPomodoro, PomodoroLog } from './types'; // Adjust the path as necessary
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
  const [pomodoroDuration, setPomodoroDuration] = useState<number>(25); // in minutes
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5); // in minutes
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15); // in minutes
  const [longBreakInterval, setLongBreakInterval] = useState<number>(4); // number of Pomodoros before a long break
  const [loading, setLoading] = useState(true);

  // Sound Settings
  const [soundAlarm, setSoundAlarm] = useState<string>('bell');
  const [soundBreak, setSoundBreak] = useState<string>('bird');

  // Timer States
  const [mode, setMode] = useState<'pomodoro' | 'short-break' | 'long-break'>(
    'pomodoro',
  );
  const [time, setTime] = useState<number>(pomodoroDuration * 60); // in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [isonpomodorolist, setIsonpomodorolist] = useState<boolean>(false);
  // Task States from Context
  const { tasks, setTasks, addTask, deleteTask, editTask } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Edit Task Inline States
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
  const [editingEstimatedPomodoros, setEditingEstimatedPomodoros] =
    useState<number>(1);
  const [editingEstimatedTime, setEditingEstimatedTime] = useState<number>(25); // in minutes
  const [editingPomodoroRequiredNumber, setEditingPomodoroRequiredNumber] =
    useState<number>(1);
  // Modal State for Adding Task
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  // Task Selection Modal State
  const [isTaskSelectModalOpen, setIsTaskSelectModalOpen] =
    useState<boolean>(false);
  // Lock Screen State
  const [isLockScreenActive, setIsLockScreenActive] = useState<boolean>(false);
  // State for form errors
  const [error, setError] = useState<string | null>(null);
  console.log(tasks);

  // Session Settings and Current Pomodoro State
  const [sessionSettings, setSessionSettings] =
    useState<SessionSettings | null>(null);
  const [currentPomodoro, setCurrentPomodoro] =
    useState<CurrentPomodoro | null>(null);
  const navigate = useNavigate(); // React Router's useNavigate hook
  // Token State
  const [token, setToken] = useState<string>('');
  const setDebugTime = (newTime: number, context: string) => {
    console.log(
      `[DEBUG] Time updated to ${newTime} in context: ${context}`,
      new Error().stack,
    );
    setTime(newTime);
  };

  // Fetch and set the token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = await getToken({ template: 'supabase' }); // Replace with your Clerk template name if applicable
        console.log(fetchedToken);
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
  }, [getToken]);
  useEffect(() => {
    if (!loading && sessionSettings) {
      if (mode === 'pomodoro') {
        setTime(sessionSettings.default_work_time * 60);
      } else if (mode === 'short-break') {
        setTime(sessionSettings.default_break_time * 60);
      } else if (mode === 'long-break') {
        setTime(sessionSettings.long_break_time * 60);
      }
    }
  }, [sessionSettings, mode]);
  // Fetch initial session settings and current pomodoro
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && token) {
          const user_id = user.id; // Adjust based on your user object

          // Fetch all session settings
          const settings = await getAllSessionSettings(token);
          console.log('Fetched Settings:', settings);
          // Find the settings for the current user

          if (settings) {
            console.log('OK', settings);
            setSessionSettings(settings);
            setPomodoroDuration(settings.default_work_time);
            setShortBreakDuration(settings.default_break_time);
            setLongBreakDuration(settings.long_break_time);
            setLongBreakInterval(settings.cycles_per_set);
            setTimeout(() => {
              if (mode === 'pomodoro') {
                setTime(settings.default_work_time * 60);
              } else if (mode === 'short-break') {
                setTime(settings.default_break_time * 60);
              } else if (mode === 'long-break') {
                setTime(settings.long_break_time * 60);
              }
            }, 500); // Adjust the delay as needed (100ms here)
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
            setTime(25 * 60); // Set default time
          }

          // Fetch current pomodoro
          // Assuming you have an endpoint to get current pomodoro by user_id
          const currentPomodoroLogs = await getAllPomodoroLogs(token);
          const userCurrentPomodoro = currentPomodoroLogs.find(
            (log: PomodoroLog) => log.user_id === user_id,
          );
          if (userCurrentPomodoro) {
            setCurrentPomodoro(userCurrentPomodoro);
            setMode(userCurrentPomodoro.session_status);
            setTime(getDefaultTime(userCurrentPomodoro.session_status));
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
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, [user, token]);

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
        if (mode === 'pomodoro') {
          setTime(updatedSessionSettings.default_work_time * 60);
        } else if (mode === 'short-break') {
          setTime(updatedSessionSettings.default_break_time * 60);
        } else if (mode === 'long-break') {
          setTime(updatedSessionSettings.long_break_time * 60);
        }
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
      setTime(getDefaultTime(mode)); // Reset timer for the new task
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
    switch (currentMode) {
      case 'pomodoro':
        return (sessionSettings?.default_work_time || pomodoroDuration) * 60; // Convert minutes to seconds
      case 'short-break':
        return (sessionSettings?.default_break_time || shortBreakDuration) * 60;
      case 'long-break':
        return (sessionSettings?.long_break_time || longBreakDuration) * 60;
      default:
        return (sessionSettings?.default_work_time || pomodoroDuration) * 60;
    }
  };

  // Function to handle mode change
  const handleModeChange = (
    newMode: 'pomodoro' | 'short-break' | 'long-break',
  ) => {
    setMode(newMode);
    setIsActive(false); // Pause timer
    setIsLockScreenActive(false); // Disable lock screen when mode changes
    setTime(getDefaultTime(newMode)); // Reset time based on new mode
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
      Date.now() - pomodoroDuration * 60 * 1000,
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
          newPomodoroNumber = 0; // Reset or adjust based on your logic
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
      try {
        // Increment pomodoro_number by 1
        const updatedTask = await updateTaskApi(selectedTask._id, {
          pomodoro_number: selectedTask.pomodoro_number + 1,
        });

        // Update the task in the context
        editTask(updatedTask);
        console.log('Updated Task:', updatedTask);

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

          // Optionally, remove the task from the Pomodoro list in the UI
          setSelectedTask(null);
        } else {
          // Update the selectedTask state to reflect the new pomodoro_number
          setSelectedTask(updatedTask);
          console.log('Selected Task Updated:', updatedTask);
        }
      } catch (error) {}
      // Update CurrentPomodoro in the backend
      await updateCurrentPomodoro(updatedCurrentPomodoro, user_id, token);
      setCurrentPomodoro(updatedCurrentPomodoro);
      console.log('Updated Current Pomodoro:', updatedCurrentPomodoro);

      // Then create Pomodoro Log
      await createPomodoroLog(logData, token);
      console.log('Pomodoro Log Created:', logData);

      // Update frontend states
      setPomodoroCount((prevCount) => prevCount + 1);

      if (newSessionStatus === 'pomodoro') {
        setTime(getDefaultTime('pomodoro'));
        setMode('pomodoro');
        setSelectedTask(null);
      } else {
        setMode(newSessionStatus);
        setTime(getDefaultTime(newSessionStatus));
      }

      // Play appropriate sound
      if (newSessionStatus === 'pomodoro') {
        playAlarmSoundFunction();
      } else {
        playBreakSoundFunction();
      }

      // Activate Lock Screen if in Pomodoro mode
      if (newSessionStatus === 'pomodoro') {
        setIsLockScreenActive(true);
      }
    } catch (error) {
      console.error('Failed to log Pomodoro session:', error);
      // Optionally, set error state to display to the user
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
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
  }, [isActive, time, selectedTask, pomodoroCount, currentPomodoro, token]);

  // Update document title with time and mode
  useEffect(() => {
    document.title = `${formatTime(time)} - ${handleModeTitle(mode)}`;
  }, [time, mode]);

  // Update timer time when settings change and no task is selected
  useEffect(() => {
    if (!selectedTask) {
      setTime(getDefaultTime(mode));
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

  // Updated handleDeleteTask function to remove from Pomodoro list
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
      setIsonpomodorolist(false);

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
        setIsLockScreenActive(false); // Disable lock screen when switching
        setSelectedTask(task);
        setTime(getDefaultTime(mode));
        // Update the newly selected task's status to 'in-progress'
        editTask({ ...task, status: 'in-progress' });
      }
    } else {
      setSelectedTask(task);
      setTime(getDefaultTime(mode));
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
        // Update the selectedTask state to reflect the new pomodoro_number
        setSelectedTask(updatedTask);
        console.log('Selected Task Updated:', updatedTask);
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

          // Optionally, remove the task from the Pomodoro list in the UI
          setSelectedTask(null);
        } else {
          // Update the selectedTask state to reflect the new pomodoro_number
          setSelectedTask(updatedTask);
          console.log('Selected Task Updated:', updatedTask);
        }
        // Increment global pomodoro count

        // Update Current Pomodoro first
        let newSessionStatus: 'pomodoro' | 'short-break' | 'long-break' =
          'pomodoro';
        let newPomodoroNumber = currentPomodoro?.current_pomodoro_number || 0;
        let newCycleNumber = currentPomodoro?.current_cycle_number || 0;

        newPomodoroNumber += 1;
        if (newPomodoroNumber >= (sessionSettings?.cycles_per_set || 4)) {
          newSessionStatus = 'long-break';
          newPomodoroNumber = 0; // Reset or adjust based on your logic
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
          setTime(getDefaultTime('pomodoro'));
          setMode('pomodoro');
          setSelectedTask(null); // Optionally deselect the task
        } else {
          setMode(newSessionStatus);
          setTime(getDefaultTime(newSessionStatus));
        }

        // Play appropriate sound
        if (newSessionStatus === 'pomodoro') {
          playAlarmSoundFunction();
        } else {
          playBreakSoundFunction();
        }

        // Activate Lock Screen only if in Pomodoro mode
        if (newSessionStatus === 'pomodoro') {
          setIsLockScreenActive(true);
        }
      } else if (mode === 'short-break' || mode === 'long-break') {
        // Transition back to Pomodoro mode
        handleModeChange('pomodoro');
      }

      setIsActive(false); // Stop the timer
      setIsLockScreenActive(false); // Disable lock screen when timer is stopped
    } catch (error) {
      console.error('Failed to skip Pomodoro:', error);
      // Optionally, set error state to display to the user
    }
  };

  // Function to initiate editing a task
  const initiateEditTask = (task: Task) => {
    setEditingTaskId(task._id);
    setEditingTaskTitle(task.title);
    setEditingEstimatedPomodoros(task.pomodoro_required_number);
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
        pomodoro_required_number: editingEstimatedPomodoros,
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
        setTime(getDefaultTime(mode));
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
          ((sessionSettings?.default_work_time || pomodoroDuration) *
            60 *
            (sessionSettings?.cycles_per_set || 4) +
            (sessionSettings?.long_break_time || longBreakDuration) * 60); // Pomodoros + Long Breaks

        // Remaining Pomodoro time
        totalSeconds +=
          leftoverPomos *
          (sessionSettings?.default_work_time || pomodoroDuration) *
          60; // Pomodoro durations
        totalSeconds +=
          (leftoverPomos > 0 ? leftoverPomos - 1 : 0) *
          (sessionSettings?.default_break_time || shortBreakDuration) *
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

  // ** New useEffect to handle overflow-hidden for modals and lock screen **
  useEffect(() => {
    if (isAddModalOpen || isTaskSelectModalOpen || isLockScreenActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddModalOpen, isTaskSelectModalOpen, isLockScreenActive]);

  // Function to toggle the timer (Start/Pause)
  const toggleTimer = async () => {
    if (isActive) {
      // Pausing the timer
      setIsActive(false);
      setIsLockScreenActive(false); // Disable lock screen when paused
    } else {
      if (selectedTask || !isSignedIn) {
        setIsActive(true);
        if (mode === 'pomodoro') {
          setIsLockScreenActive(true); // Activate lock screen only for pomodoro
        } else {
          setIsLockScreenActive(false); // Do not activate lock screen for breaks
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

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar (Optional for Larger Screens) */}
      {/* Uncomment and customize if you wish to add a sidebar */}
      {/* <div className="hidden md:block md:w-1/5 lg:w-1/6 bg-gray-100 p-4">
        {/* Sidebar Content */}
      {/* </div> */}

      {/* Main Content */}
      <div
        className={`flex flex-col w-full min-h-screen ${getBackgroundColor()} relative overflow-auto h-full`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-center items-center w-full bg-white/70 p-4">
          <div className="flex justify-between items-center w-full max-w-3xl mx-auto">
            <div className="flex justify-center items-center text-lg font-bold text-zinc-700 mb-4 sm:mb-0">
              <GiTomato className="mr-2" />
              <p>Pomofocus</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center rounded-md p-2 px-4 bg-white shadow-md text-zinc-700 font-semibold hover:bg-gray-100 transition">
                <FaRegChartBar className="mr-2" />
                Report
              </button>
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
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-center mt-10 w-full px-4">
          <div className="flex flex-col justify-between items-center w-full max-w-lg md:max-w-xl lg:max-w-2xl h-auto bg-white rounded-lg shadow-md p-6 relative">
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
              {loading ? (
                <p className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-400">
                  Loading...
                </p>
              ) : (
                <p className="text-6xl sm:text-7xl md:text-8xl font-semibold text-[#5f341f]">
                  {formatTime(time)}
                </p>
              )}
            </div>

            {/* Start/Pause and Skip Buttons */}
            <div className="flex w-full h-12 justify-center items-center relative space-x-2 sm:space-x-4">
              {/* Start/Pause Button */}
              <button
                onClick={toggleTimer}
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
          <p className="text-[#5f341f] text-lg sm:text-xl font-bold">
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
              <p className="text-lg sm:text-xl font-semibold">
                {selectedTask.title}
              </p>
              {selectedTask.status === 'completed' && (
                <p className="text-sm sm:text-base text-green-700">
                  Completed!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="flex flex-col items-center justify-center mt-3 space-y-5 w-full px-4">
          {/* Tasks Header */}
          <div className="flex flex-col sm:flex-row w-full max-w-3xl lg:max-w-4xl justify-between items-center border-b-2 border-gray-300 py-2">
            <p className="text-lg sm:text-xl font-bold text-[#5f341f]">Tasks</p>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {/* Add Task Button */}
              {isSignedIn ? (
                <button
                  onClick={openTaskSelectModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Select Task
                </button>
              ) : (
                <button
                  onClick={openAddTaskModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Add Task
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 bg-white shadow-md rounded-md hover:bg-gray-100 transition">
                    <IoMdMore className="h-6 w-6 text-gray-700" />
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
                              setTime(getDefaultTime(mode));
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
                            setTime(getDefaultTime(mode));
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
          <div className="flex flex-col w-full max-w-3xl lg:max-w-4xl mt-4">
            {tasks.length === 0 && (
              <p className="text-center text-gray-500">No tasks available.</p>
            )}
            {tasks.length > 0 && (
              <ul className="space-y-2 overflow-y-auto max-h-60 sm:max-h-80">
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
                              className="w-full p-2 border rounded-md"
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
                              className="w-full p-2 border rounded-md"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={cancelEditTask}
                              className="px-4 py-2 bg-gray-300 rounded-md"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEditedTask(task._id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Task Display
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
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
                                        setTime(getDefaultTime(mode));
                                        setSelectedTask(null);
                                        setIsLockScreenActive(false); // Disable lock screen if task is completed
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
                                className="form-checkbox h-5 w-5 text-red-600"
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
                            <span className="text-sm font-semibold text-[#5f341f]">
                              {task.pomodoro_number}/
                              {task.pomodoro_required_number}
                            </span>
                            {/* Options Dropdown */}
                            {isSignedIn && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-2 bg-white shadow-md rounded-md hover:bg-gray-100 transition">
                                    <IoMdMore className="h-5 w-5 text-gray-700" />
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

          <div className="mt-4 p-4 bg-white shadow-md rounded-md max-w-3xl lg:max-w-4xl w-full">
            <p className="text-gray-700 text-base sm:text-lg">
              <span className="font-semibold text-[#5f341f]">Pomos:</span>{' '}
              {totalPomodorosCompleted}/{totalPomodorosPlanned}
            </p>
            <p className="text-gray-700 text-base sm:text-lg">
              <span className="font-semibold text-[#5f341f]">
                Estimated Finish Time:
              </span>{' '}
              {calculateCompletionTimeWithRemaining()}
            </p>
          </div>

          {/* Spotify Iframe */}
          <div className="w-full max-w-3xl lg:max-w-4xl mt-6 px-4">
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

        {/* Lock Screen Overlay */}
        {isLockScreenActive && mode === 'pomodoro' && isActive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-11/12 sm:w-full text-center">
              <GiTomato className="mx-auto text-red-600 w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-[#5f341f]">
                Stay Focused!
              </h2>
              <p className="text-gray-700 mb-6">
                The timer is running. Please focus on your task.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsLockScreenActive(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Pause Timer
                </button>
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition text-sm sm:text-base"
                >
                  Skip Pomodoro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Selection Modal */}
        {isTaskSelectModalOpen && isSignedIn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-96 p-6">
              <h2 className="text-xl font-bold mb-4">Select a Task</h2>
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
                        className="p-4 bg-gray-100 rounded-md shadow cursor-pointer hover:bg-gray-200 transition"
                        onClick={() => handleTaskSelect(task)}
                      >
                        <p className="font-semibold text-base sm:text-lg">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500">
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
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeTaskSelectModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-96 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-[#5f341f]">
                Add New Task
              </h2>
              <form onSubmit={handleAddTaskFromModal} className="space-y-4">
                {/* Task Title */}
                <div>
                  <Label htmlFor="new-task-title" className="font-bold mb-1">
                    Task Title
                  </Label>
                  <Input
                    id="new-task-title"
                    type="text"
                    value={editingTaskTitle}
                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                    className="bg-white shadow-inner placeholder-gray-400 rounded-md w-full"
                    required
                  />
                </div>

                {/* Pomodoro Required */}
                <div>
                  <Label htmlFor="new-task-pomos" className="font-bold mb-1">
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
                    className="w-full text-center border-t border-b border-gray-300 focus:ring-2 focus:ring-[#5f341f] rounded-md"
                    required
                  />
                </div>

                {/* Estimated Time */}
                <div>
                  <Label htmlFor="new-task-time" className="font-bold mb-1">
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
                    className="w-full text-center border-t border-b border-gray-300 focus:ring-2 focus:ring-[#5f341f] rounded-md"
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
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
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
