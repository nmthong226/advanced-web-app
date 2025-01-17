// src/components/Analytics.tsx

import React, { useEffect, useState } from 'react';

// Import icons
import { GiTomato } from 'react-icons/gi';
import { IoCalendar } from 'react-icons/io5';
import { TbClockHour3Filled } from 'react-icons/tb';
import { RiFireFill } from 'react-icons/ri';
import { BsListTask } from 'react-icons/bs';
import { AiFillInfoCircle } from 'react-icons/ai';
import { FaExclamationCircle } from 'react-icons/fa';

// Import chart components
import PieChart from '../../components/charts/PieChart';
import DoubleBarChart from '../../components/charts/DoubleBarChart';
import AIFeedback from '../../components/AI/analytics';
import { getAISummary } from 'src/api/analytics.api';
// Import UI components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

// Import libs/packages
import { DayPilot, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { CalendarDaysIcon } from 'lucide-react';

// Import Task Context
import { useTaskContext } from '../../contexts/UserTaskContext';

// Import Axios functions and interfaces
import {
  fetchPomodoroAnalytics,
  CircleChartData,
  WeeklyTaskCounts,
  PomodoroAnalytics,
} from 'src/api/analytics.api';

// Import Clerk's useUser hook
import { useUser } from '@clerk/clerk-react';

// Import react-spinners for loading indicator
import { ClipLoader } from 'react-spinners';
import { LuCalendarClock } from 'react-icons/lu';
import BarChart from '../../components/charts/BarChart';

// Define Task interface if not already defined
interface TaskStatusCounts {
  completed: number;
  'in-progress': number;
  pending: number;
  expired: number;
}

const Analytics: React.FC = () => {
  // Obtain user information from Clerk
  const { user } = useUser();
  const userId = user?.id;
  const [aiSummaryInsights, setAiSummaryInsights] = useState(() => {
    const cachedSummary = localStorage.getItem('aiSummaryInsights');
    return cachedSummary ? JSON.parse(cachedSummary) : null;
  });

  useEffect(() => {
    const getAiSummaryInsights = async () => {
      if (userId) {
        try {
          const response = await getAISummary(userId);
          if (response?.data) {
            setAiSummaryInsights(response.data);
            localStorage.setItem(
              'aiSummaryInsights',
              JSON.stringify(response.data),
            );
          } else {
            alert('Something went wrong while fetching AI summary insights.');
          }
        } catch (error) {
          console.error('Error fetching AI summary insights:', error);
        }
      }
    };

    if (!aiSummaryInsights) {
      getAiSummaryInsights();
    }
  }, [userId, aiSummaryInsights]);
  // Consume Task Context
  const { tasks } = useTaskContext();

  const [taskStatusCounts, setTaskStatusCounts] =
    useState<TaskStatusCounts | null>(null);

  const [, setCategoryHours] = useState<{
    [category: string]: number;
  } | null>(null);

  const [, setTimeVsTaskCompletion] = useState<{
    timeSpent: number;
    tasksCompleted: number;
  } | null>(null);

  const [, setTopCategories] = useState<{
    [category: string]: number;
  } | null>(null);

  const [, setAIFeedback] = useState<string>('');

  // Additional State for API Data
  const [, setCircleChartData] = useState<CircleChartData | null>(null);
  const [weeklyTaskCounts, setWeeklyTaskCounts] =
    useState<WeeklyTaskCounts | null>(null);
  const [pomodoroAnalytics, setPomodoroAnalytics] =
    useState<PomodoroAnalytics | null>(null);
  // State for Pomodoro
  const [pomodoroStats, setPomodoroStats] = useState({
    pomodoroDone: 0,
    pomodoroRemaining: 0,
  });
  // State for loading and error handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calendar and Date State
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<string>('2024-12-01'); // Default date

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
  };

  // Function to process tasks data
  useEffect(() => {
    // 1. User Authentication Check
    if (!userId) {
      console.warn('User not authenticated.');
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    // 2. Handle No Tasks Scenario
    if (tasks.length === 0) {
      console.info('No tasks found for the user. Resetting analytics data.');
      setPomodoroStats({ pomodoroDone: 5, pomodoroRemaining: 5 });
      setTaskStatusCounts(null);
      setWeeklyTaskCounts(null);
      setCategoryHours(null);
      setTimeVsTaskCompletion(null);
      setTopCategories(null);
      setAIFeedback('');
      setCircleChartData(null);
      setPomodoroAnalytics(null);
      setLoading(false);
      return;
    }

    // 3. Define Asynchronous Data Processing Function
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- Task Data Processing ---

        // a. Calculate Active Days (unique days with at least one task)
        const activeDaysSet = new Set<string>();
        tasks.forEach((task) => {
          if (task.startTime) {
            activeDaysSet.add(new Date(task.startTime).toDateString());
          }
        });

        // b. Calculate Spent Hours (sum of estimatedTime for completed tasks)
        const spentHours =
          tasks
            .filter((task) => task.status === 'completed' && task.estimatedTime)
            .reduce((acc, task) => acc + (task.estimatedTime || 0), 0) / 60; // Convert minutes to hours

        // Calculate Pomodoro Stats
        let totalPomodoroDone = 0;
        let totalPomodoroRemaining = 0;
        tasks.forEach((task) => {
          totalPomodoroDone += task.pomodoro_number || 0;
          totalPomodoroRemaining +=
            (task.pomodoro_required_number || 0) - (task.pomodoro_number || 0);
        });

        setPomodoroStats({
          pomodoroDone: totalPomodoroDone,
          pomodoroRemaining: totalPomodoroRemaining,
        });

        // d. Calculate Pomodoro Per Day (using tasks' pomodoro_number)
        const pomodoroPerDayMap: { [date: string]: number } = {};
        tasks.forEach((task) => {
          if (task.endTime) {
            const date = new Date(task.endTime).toISOString().split('T')[0];
            pomodoroPerDayMap[date] =
              (pomodoroPerDayMap[date] || 0) + (task.pomodoro_number || 0);
          }
        });

        // e. Compute Task Status Counts on Frontend
        const statusCounts = {
          completed: 0,
          'in-progress': 0,
          pending: 0,
          expired: 0,
        };
        tasks.forEach((task) => {
          if (task.status in statusCounts) {
            statusCounts[task.status] += 1;
          }
        });
        console.log('ABC', statusCounts);

        setTaskStatusCounts(statusCounts);

        // f. Compute Weekly Task Counts on Frontend
        // Define the current week range
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        console.log(`Weekly Task Counts Range: ${startOfWeek} to ${endOfWeek}`);

        const weeklyTaskCountsMap: {
          [date: string]: {
            completed: number;
            'in-progress': number;
            pending: number;
            expired: number;
            timeSpent: number;
            estimatedTime: number;
          };
        } = {};

        // Initialize the map with dates of the current week
        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startOfWeek);
          currentDate.setDate(startOfWeek.getDate() + i);
          const dateString = currentDate.toISOString().split('T')[0];
          weeklyTaskCountsMap[dateString] = {
            completed: 0,
            'in-progress': 0,
            pending: 0,
            expired: 0,
            timeSpent: 0, // Total time spent on completed tasks
            estimatedTime: 0, // Total estimated time for all tasks
          };
        }

        // Populate the map with task counts and time metrics per day
        tasks.forEach((task, index) => {
          if (task.startTime) {
            const taskDate = new Date(task.startTime)
              .toISOString()
              .split('T')[0];

            // Debug: Log task details
            console.log(`\nProcessing Task ${index + 1}:`);
            console.log(`Start Time: ${task.startTime}`);
            console.log(`Extracted Task Date: ${taskDate}`);
            console.log(`Task Status: ${task.status}`);
            console.log(`Estimated Time: ${task.estimatedTime || 0} minutes`);

            // Validate if the date exists in the map
            const dateExists = Object.prototype.hasOwnProperty.call(
              weeklyTaskCountsMap,
              taskDate,
            );
            if (!dateExists) {
              console.warn(
                `Date ${taskDate} not found in weeklyTaskCountsMap. Skipping task.`,
              );
              return; // Skip to the next task
            }

            // Validate if the status exists for the date
            const statusExists = Object.prototype.hasOwnProperty.call(
              weeklyTaskCountsMap[taskDate],
              task.status,
            );
            if (!statusExists) {
              console.warn(
                `Status '${task.status}' not recognized for date ${taskDate}. Skipping task.`,
              );
              return; // Skip to the next task
            }

            // Update Task Status Count
            weeklyTaskCountsMap[taskDate][task.status] += 1;
            console.log(
              `Incremented '${task.status}' count for ${taskDate}: ${weeklyTaskCountsMap[taskDate][task.status]}`,
            );

            // Update Estimated Time
            const estimatedTimeToAdd = task.estimatedTime || 0;
            weeklyTaskCountsMap[taskDate].estimatedTime += estimatedTimeToAdd;
            console.log(
              `Added ${estimatedTimeToAdd} minutes to 'estimatedTime' for ${taskDate}: ${weeklyTaskCountsMap[taskDate].estimatedTime} minutes total`,
            );

            // Update Time Spent if Task is Completed
            if (task.status === 'completed') {
              const timeSpentToAdd = task.estimatedTime || 0;
              weeklyTaskCountsMap[taskDate].timeSpent += timeSpentToAdd;
              console.log(
                `Added ${timeSpentToAdd} minutes to 'timeSpent' for ${taskDate}: ${weeklyTaskCountsMap[taskDate].timeSpent} minutes total`,
              );
            }
          } else {
            console.log(
              `\nTask ${index + 1} does not have a startTime. Skipping task.`,
            );
          }
        });

        console.log('Weekly Task Counts Map:', weeklyTaskCountsMap);
        setWeeklyTaskCounts(weeklyTaskCountsMap);

        // g. Compute Category Hours on Frontend
        const categoryHoursMap: { [category: string]: number } = {};
        tasks.forEach((task) => {
          if (task.category && task.estimatedTime) {
            categoryHoursMap[task.category] =
              (categoryHoursMap[task.category] || 0) + task.estimatedTime;
          }
        });
        console.log('Category Hours Map:', categoryHoursMap);
        setCategoryHours(categoryHoursMap);

        // h. Calculate Time vs Task Completion on Frontend
        const totalTimeSpent = tasks.reduce(
          (acc, task) => acc + (task.estimatedTime || 0),
          0,
        );
        const totalTasksCompleted = statusCounts.completed;
        console.log('Total Time Spent (minutes):', totalTimeSpent);
        console.log('Total Tasks Completed:', totalTasksCompleted);
        setTimeVsTaskCompletion({
          timeSpent: totalTimeSpent,
          tasksCompleted: totalTasksCompleted,
        });

        // i. Calculate Top Categories (Top 5) on Frontend
        // Calculate Category Counts (Task Counts by Category)
        const categories: { [category: string]: number } = {};
        tasks.forEach((task) => {
          if (task.category) {
            categories[task.category] = (categories[task.category] || 0) + 1;
          }
        });
        console.log('Categories:', categories);
        setTopCategories(categories);

        // j. Generate AI Feedback based on data (Mock Implementation)
        let feedback = '';
        if (statusCounts.completed < 5) {
          feedback +=
            'You have completed fewer tasks than expected. Consider prioritizing your tasks better.\n';
        }
        if (spentHours > 20) {
          feedback +=
            'You have spent a significant amount of time on tasks. Ensure to take regular breaks to avoid burnout.\n';
        }
        if (statusCounts.pending > 10) {
          feedback +=
            'There are many pending tasks. Try to address them to maintain productivity.\n';
        }
        console.log(
          'AI Feedback:',
          feedback || 'Great job! Keep up the good work.',
        );
        setAIFeedback(feedback || 'Great job! Keep up the good work.');

        // k. Compute Circle Chart Data on Frontend
        const computedCircleChartData = {
          completed: statusCounts.completed,
          'in-progress': statusCounts['in-progress'],
          pending: statusCounts.pending,
          expired: statusCounts.expired,
        };
        console.log('Computed Circle Chart Data:', computedCircleChartData);
        setCircleChartData(computedCircleChartData);

        // l. Compute Pomodoro Stats on Frontend
        const totalPomodoros = tasks.reduce(
          (acc, task) => acc + (task.pomodoro_number || 0),
          0,
        );
        console.log('Total Pomodoros from Task List:', totalPomodoros);

        const pomodorosPerCategory: { [category: string]: number } = {};
        tasks.forEach((task) => {
          if (task.category && task.pomodoro_number) {
            pomodorosPerCategory[task.category] =
              (pomodorosPerCategory[task.category] || 0) + task.pomodoro_number;
          }
        });
        console.log('Pomodoros Per Category:', pomodorosPerCategory);

        setPomodoroStats((prev) => ({
          ...prev!,
          totalPomodoros,
        }));

        // m. Fetch Pomodoro Analytics from Backend
        try {
          console.log('Fetching Pomodoro Analytics from backend.');
          const pomodoroData: PomodoroAnalytics =
            await fetchPomodoroAnalytics(userId);
          console.log('Pomodoro Analytics Data:', pomodoroData);
          setPomodoroAnalytics(pomodoroData);
        } catch (pomodoroError) {
          console.error('Error fetching Pomodoro Analytics:', pomodoroError);
          setError('Failed to fetch Pomodoro analytics data.');
          // Depending on requirements, you might want to continue processing or halt here
        }

        setLoading(false);
        console.log('Data fetching and processing completed successfully.');
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to fetch analytics data.');
        setLoading(false);
      }
    };

    // 4. Invoke the asynchronous fetchData function
    fetchData();
  }, [tasks, userId]);
  // Loading and Error States
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={50} color={'#4BC0C0'} loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex p-2 w-full h-screen">
      {/* Main Container */}
      <div className="flex lg:flex-row flex-col gap-4 w-full h-full">
        {/* Left Column: Pomodoro & Task Status */}
        <div className="flex flex-col gap-4 lg:w-1/3 h-full">
          {/* Pomodoro Statistics */}
          <div className="flex flex-col justify-center items-center bg-white shadow-md p-4 rounded-md h-1/2">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <GiTomato className="mr-2 text-red-500" size={24} />
                <p className="font-semibold text-lg">Pomodoro</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center ml-2 hover:cursor-pointer">
                        <AiFillInfoCircle className="text-gray-500" size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white shadow-xl border text-muted-foreground text-zinc-700">
                      <p>Track your Pomodoro productivity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            {/* Pomodoro Metrics */}
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 mb-4">
              <div className="flex flex-col items-center bg-gray-100 shadow-sm p-2 rounded-md">
                <IoCalendar className="mb-1 text-indigo-500" size={20} />
                <p className="font-bold text-xl">
                  {pomodoroAnalytics?.activeDays ?? 0}
                </p>
                <p className="text-[12px]">Active days</p>
              </div>
              <div className="flex flex-col items-center bg-gray-100 shadow-sm p-2 rounded-md">
                <TbClockHour3Filled className="mb-1 text-green-500" size={20} />
                <p className="font-bold text-xl">
                  {pomodoroStats?.pomodoroDone ?? 0}
                </p>
                <p className="text-[12px]">Completed Pomos</p>
              </div>
              <div className="flex flex-col items-center bg-gray-100 shadow-sm p-2 rounded-md">
                <RiFireFill className="mb-1 text-yellow-500" size={20} />
                <p className="font-bold text-xl">
                  {pomodoroStats?.pomodoroRemaining ?? 0}
                </p>
                <p className="text-[12px]">Pomo Remaining</p>
              </div>
            </div>
          </div>
          {/* Task Status */}
          <div className="flex flex-col justify-center bg-white shadow-md p-4 lg:p-2 xl:p-4 rounded-md h-[480px]">
            {/* Header */}
            <div className="flex justify-between">
              <div className="flex items-center">
                <BsListTask className="mr-2" size={20} />
                <p className="font-semibold text-nowrap">Task Status</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center ml-2 hover:cursor-pointer">
                        <AiFillInfoCircle className="text-gray-500" size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white shadow-xl border text-muted-foreground text-zinc-700">
                      <p>Track your task's status</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative flex space-x-2">
                {/* Calendar Button */}
                <button
                  className="flex items-center bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-md text-sm text-white transition"
                  onClick={toggleCalendar}
                >
                  <CalendarDaysIcon className="mr-2 w-4 h-4" />
                  <p className="sm:inline-block hidden">
                    {new DayPilot.Date(startDate).toString('dd')} -{' '}
                    {new DayPilot.Date(startDate)
                      .addDays(6)
                      .toString('dd MMM yy')}
                  </p>
                </button>

                {/* Information Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex justify-center items-center bg-gradient-to-r from-indigo-500 to-cyan-400 p-[1px] rounded-full w-7 h-7">
                      <div className="flex justify-center items-center bg-white rounded-full w-full h-full">
                        <p className="bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400 font-bold text-center text-transparent">
                          ✨
                        </p>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="flex flex-col space-y-4">
                    <DialogHeader>
                      <DialogTitle>Task Status</DialogTitle>
                      <DialogDescription>
                        Track your task's status
                      </DialogDescription>
                    </DialogHeader>
                    {taskStatusCounts ? (
                      <div className="flex flex-col space-y-4">
                        {/* Task Pie Chart */}
                        <div className="flex justify-center p-2 border rounded-md w-full h-40">
                          <PieChart data={taskStatusCounts} />
                        </div>
                        {/* AI Analysis and Suggestions */}
                        <div className="flex flex-col space-y-2 bg-gray-50 p-2 rounded-md w-full h-48 overflow-y-auto">
                          <h5 className="flex items-center gap-1 font-mono font-semibold text-sm">
                            ✨ AI Analysis
                          </h5>
                          <ul className="flex flex-col space-y-1 pl-5 text-[12px] list-disc">
                            <li>
                              Pending Tasks: With {taskStatusCounts.pending}{' '}
                              pending tasks (
                              {tasks.length > 0
                                ? (
                                  (taskStatusCounts.pending / tasks.length) *
                                  100
                                ).toFixed(2)
                                : '0.00'}
                              %), it's important to prioritize these to avoid
                              bottlenecks and ensure smooth workflow
                              progression.
                            </li>
                            <li>
                              Completed Tasks: Having{' '}
                              {taskStatusCounts.completed} completed tasks (
                              {tasks.length > 0
                                ? (
                                  (taskStatusCounts.completed /
                                    tasks.length) *
                                  100
                                ).toFixed(2)
                                : '0.00'}
                              %) is a positive sign of productivity. However,
                              there's room for improvement to increase the
                              completion rate.
                            </li>
                            <li>
                              In-Progress Tasks:{' '}
                              {taskStatusCounts['in-progress']} tasks (
                              {tasks.length > 0
                                ? (
                                  (taskStatusCounts['in-progress'] /
                                    tasks.length) *
                                  100
                                ).toFixed(2)
                                : '0.00'}
                              %) are currently in progress, indicating steady
                              work. Ensuring these tasks are completed soon will
                              help reduce the pending load.
                            </li>
                          </ul>
                          <h5 className="flex items-center gap-1 font-mono font-semibold text-sm">
                            <FaExclamationCircle className="mr-1 text-orange-500" />
                            Suggestions:
                          </h5>
                          <ul className="flex flex-col space-y-1 pl-5 text-[12px] list-disc">
                            <li>
                              Focus on resolving pending tasks to reduce
                              backlog.
                            </li>
                            <li>
                              Streamline the process for in-progress tasks to
                              accelerate their completion.
                            </li>
                            <li>
                              Maintain the momentum of completed tasks to stay
                              on track with goals.
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No Task Data Available
                      </p>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              {/* Conditional rendering of the calendar */}
              {isCalendarVisible && (
                <div className="z-50 absolute flex bg-gray-50 shadow-md p-2 border rounded-md">
                  <DayPilotNavigator
                    selectMode={'Week'}
                    showMonths={1}
                    skipMonths={1}
                    selectionDay={new DayPilot.Date(startDate)}
                    onTimeRangeSelected={(args) => {
                      setStartDate(
                        new DayPilot.Date(args.day).toString('yyyy-MM-dd'),
                      );
                      setIsCalendarVisible(false); // Hide calendar after selecting a date
                      // Optionally, refetch or update data based on the new date range
                    }}
                  />
                </div>
              )}
            </div>
            <hr className='my-4 border-t-[1px] w-full' />
            {/* Task Status Chart */}
            <div className="flex flex-col justify-center items-center">
              {taskStatusCounts ? (
                <PieChart data={taskStatusCounts} />
              ) : (
                <p className="text-center text-gray-500">
                  No Task Status Data Available
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Middle Column: Category Charts */}
        <div className="flex flex-col gap-4 lg:w-1/3 h-full">
          {/* Weekly Task Counts */}
          <div className="flex flex-col flex-1 bg-white shadow-md p-4 rounded-md h-1/2">
            <div className='flex justify-between'>
              <p className='flex items-center font-semibold'>
                <LuCalendarClock className="mr-2" />
                Weekly Task Counts
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center ml-2 hover:cursor-pointer">
                      <AiFillInfoCircle className="text-gray-500" size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white shadow-xl border text-muted-foreground text-zinc-700">
                    <p>Track your pomodoro's status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {weeklyTaskCounts ? (
              <DoubleBarChart data={weeklyTaskCounts} />
            ) : (
              <p className="text-center text-gray-500">
                No Weekly Task Counts Data Available
              </p>
            )}
          </div>
          {/* Pomodoro Analytics */}
          <div className="flex flex-col flex-1 bg-white shadow-md p-4 rounded-md h-1/2">
            <div className='flex justify-between'>
              <div className="flex items-center font-semibold text-sm">
                <GiTomato className="mr-2" />
                <p>Pomodoro Analytics</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center ml-2 hover:cursor-pointer">
                      <AiFillInfoCircle className="text-gray-500" size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white shadow-xl border text-muted-foreground text-zinc-700">
                    <p>Track your pomodoro's status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* Pomodoro Analytics */}
            <div className="flex flex-1 bg-white shadow-md p-4 rounded-md">
              {pomodoroAnalytics ? (
                /* Assuming PomodoroAnalytics.weeklyPomodoro is suitable for BarChart */
                <BarChart
                  data={Object.entries(pomodoroAnalytics.weeklyPomodoro).map(
                    ([date, count]) => ({ date, count }),
                  )}
                  className='h-full'
                />
              ) : (
                <p className="text-center text-gray-500">
                  No Pomodoro Analytics Data Available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Top Categories & AI Feedback */}
        <div className="flex flex-col gap-4 shadow-md lg:w-1/3">
          {/* AI Feedback */}
          <div className="flex bg-white p-2 rounded-md w-full h-full">
            <AIFeedback />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
