//Import frameworks
import { useEffect, useState } from "react";

//Import libs/packages
import { DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import dayjs from 'dayjs';

//Import components
import Chart from "../../components/charts/BarChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import OnlyShownWeekTask from "../../components/onlyshowncalendar/WeekMode/OnlyShownWeekCalendar";
import OnlyShownMonthCalendar from "../../components/onlyshowncalendar/MonthMode/OnlyShownMonthCalendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import ChatAI from "../../components/AI/chatHistory";

//Import icons
import { CalendarDaysIcon } from "lucide-react";
import { BsListTask } from "react-icons/bs";
import { GiTomato } from "react-icons/gi";
import { FaAngleLeft, FaAngleRight, FaCheck } from "react-icons/fa6";
import { RiRestTimeLine } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";

//Import contexts
import { useSettings } from "../../contexts/SettingsContext";
import { useUser } from "@clerk/clerk-react";
import { MdOutlineViewWeek } from "react-icons/md";

const Home = () => {
  const { user } = useUser();
  const { settings, showLeftBar } = useSettings();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isMorning, setIsMorning] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>("Good Morning");

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Week's starting date (YYYY-MM-DD)
  });
  const [month, setMonth] = useState(new Date().getMonth()); // 0-based index (0 = January)
  const [year, setYear] = useState(new Date().getFullYear());

  const [calendarView, setCalendarView] = useState<'Week' | 'Month'>('Week'); // State for calendar view
  const handleViewChange = (view: 'Week' | 'Month') => {
    setCalendarView(view);
  };
  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
  };

  // Function to update the current time
  const updateTime = () => {
    const now = dayjs(); // Use dayjs for better formatting
    const formattedTime = now.format('hh:mm A, DD MMM YYYY'); // Format as 12-hour time with AM/PM, date and year
    setCurrentTime(formattedTime);

    // Determine if it's morning or night based on the hour
    const hour = now.hour();
    setIsMorning(hour < 12); // Morning is before 12 PM

    // Set the greeting based on the time of day
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  };

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    updateTime(); // Initial call to set the time immediately
    return () => clearInterval(timer); // Clear the interval when the component is unmounted
  }, []);

  // Week navigation
  const handlePreviousWeek = () => {
    const current = new Date(startDate);
    current.setDate(current.getDate() - 7); // Subtract 7 days
    setStartDate(current.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
    const current = new Date(startDate);
    current.setDate(current.getDate() + 7); // Add 7 days
    setStartDate(current.toISOString().split('T')[0]);
  };

  // Month navigation
  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11); // December
      setYear((prevYear) => prevYear - 1);
    } else {
      setMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0); // January
      setYear((prevYear) => prevYear + 1);
    } else {
      setMonth((prevMonth) => prevMonth + 1);
    }
  };

  // Reset to "Today"
  const handleToday = () => {
    const today = new Date();
    if (calendarView === 'Week') {
      setStartDate(today.toISOString().split('T')[0]);
    } else {
      setMonth(today.getMonth());
      setYear(today.getFullYear());
    }
  };

  // Conditional navigation
  const handlePrevious = () => {
    if (calendarView === 'Week') {
      handlePreviousWeek();
    } else {
      handlePreviousMonth();
    }
  };

  const handleNext = () => {
    if (calendarView === 'Week') {
      handleNextWeek();
    } else {
      handleNextMonth();
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-slate-800 p-2 w-full h-full overflow-y-hidden">
      {showLeftBar && (
        <div className="flex flex-col space-y-4 w-[25%] h-full">
          {/*Show greetings*/}
          {settings.showGreetings && (
            <div className="flex flex-col bg-white dark:bg-slate-600 shadow-md p-1 rounded-lg w-full h-[10%]">
              <div
                className={`flex flex-col w-full h-full border rounded-lg items-start justify-center pl-4 
          ${isMorning ? 'bg-gradient-to-b from-sky-400 to-indigo-100 dark:to-indigo-800' : 'bg-gradient-to-b from-purple-400 to-indigo-100 dark:to-indigo-800'}`}
              >
                <p className="font-base text-[13px] text-zinc-500 dark:text-gray-100">{currentTime}</p>
                <p className="font-semibold text-lg text-zinc-700 dark:text-white truncate">{greeting}, {user?.fullName}!</p>
              </div>
            </div>
          )}
          {/*Upcoming task or activity*/}
          {settings.showUpcoming && (
            <div className="flex flex-col bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg w-full h-[15%]">
              <div className="flex flex-col justify-start w-full">
                <div className="flex justify-between items-center border-b">
                  <p className="m-2 font-semibold text-sm">Your Upcoming</p>
                  <div className="flex space-x-1 text-[12px]">
                    <button className="px-1.5 border rounded-sm w-14">Activity</button>
                    <button className="px-1.5 border rounded-sm w-14">Task</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/*Task Overview*/}
          {settings.showTaskOverview && (
            <div className="flex flex-col justify-between bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg w-full h-[40%]">
              <div className="flex flex-col w-full h-[85%]">
                <div className="flex justify-between items-center border-b">
                  <p className="m-2 font-semibold text-sm">Task Overview</p>
                  <div className="flex space-x-1">
                    <div className="bg-indigo-400 rounded-full w-2 h-2 hover:cursor-pointer" />
                    <div className="bg-slate-300 rounded-full w-2 h-2 hover:cursor-pointer" />
                    <div className="bg-slate-300 rounded-full w-2 h-2 hover:cursor-pointer" />
                    <div className="bg-slate-300 rounded-full w-2 h-2 hover:cursor-pointer" />
                  </div>
                  <Select value="all">
                    <SelectTrigger className="m-2 w-[110px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent className="right-[14%]">
                      <SelectItem value="all">
                        <div className="flex items-center text-[12px]">
                          <BsListTask className="mr-1 size-3" />
                          All Tasks
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div className="flex items-center text-[12px]">
                          <FaCheck className="mr-1 size-3" />
                          Completed
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center text-[12px]">
                          <RiRestTimeLine className="mr-1 size-3" />
                          Pending
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1 custom-scrollbar p-1 overflow-y-auto">
                </div>
              </div>
              <div className="flex items-center p-2 border-t-2 h-[15%]">
                <p className="flex mr-2 text-[12px] text-nowrap">Progress: </p>
                <ProgressBar
                  completed={2}
                  pending={2}
                  todo={1}
                />
              </div>
            </div>
          )}
          {/*Chart Overview*/}
          {settings.showProductivityInsights && (
            <div className="flex flex-col justify-between bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg w-full h-[30%]">
              <div className="flex justify-between items-center">
                <p className="m-2 font-semibold text-sm">Productivity Insights</p>
                <Select value="pomo">
                  <SelectTrigger className="m-2 w-[100px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className="right-[20%]">
                    <SelectItem value="task">
                      <div className="flex items-center text-[12px]">
                        <BsListTask className="mr-1 size-3" />
                        Task
                      </div>
                    </SelectItem>
                    <SelectItem value="pomo">
                      <div className="flex items-center text-[12px]">
                        <GiTomato className="mr-1 size-3" />
                        Pomo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Chart />
            </div>
          )}
        </div>
      )}
      <div className={`relative flex flex-col bg-white dark:bg-slate-700 shadow-md p-1 rounded-lg ${showLeftBar ? 'w-[75%]' : 'w-full'} h-full`}>
        <div className="flex flex-row justify-between p-1">
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex">
              <div
                className="flex items-center border-2 px-1 py-0.5 rounded-l-md cursor-pointer"
                onClick={handlePrevious}
              >
                <FaAngleLeft />
              </div>
              <div
                className="border-2 border-x-0 px-2 py-0.5 cursor-pointer"
                onClick={handleToday}
              >
                Today
              </div>
              <div
                className="flex items-center border-2 px-1 py-0.5 rounded-r-md cursor-pointer"
                onClick={handleNext}
              >
                <FaAngleRight />
              </div>
            </div>
            <button
              className='flex items-center border-2 px-2 py-0.5 rounded-md'
              onClick={toggleCalendar}
            >
              <CalendarDaysIcon className='mr-2 w-4 h-4' />
              <p>
                {new DayPilot.Date(startDate).toString('dd')} -{' '}
                {new DayPilot.Date(startDate)
                  .addDays(6)
                  .toString('dd MMM yy')}
              </p>
            </button>
            {isCalendarVisible && (
              <div className='top-9 left-4 z-50 absolute bg-gray-50 dark:bg-slate-700 shadow-md p-2 border rounded-md'>
                <DayPilotNavigator
                  selectMode={'Week'}
                  showMonths={1}
                  skipMonths={1}
                  selectionDay={new DayPilot.Date(startDate)}
                  onTimeRangeSelected={args => {
                    setStartDate(
                      new DayPilot.Date(args.day).toString('yyyy-MM-dd'),
                    );
                    setIsCalendarVisible(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="relative flex justify-end items-center space-x-2 text-sm">
            <DropdownMenu>
              <DropdownMenuTrigger className='outline-none'>
                <button className='flex items-center border-2 px-2 py-0.5 rounded-md w-[90px] outline-none'>
                  <MdOutlineViewWeek className='mr-2 w-4 h-4' />
                  <p>{calendarView === 'Week' ? '7 days' : 'Month'}</p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='ml-10 w-[120px]'>
                <DropdownMenuItem
                  className='text-[12px]'
                  onClick={() => handleViewChange('Week')}
                >
                  7 days
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-[12px]'
                  onClick={() => handleViewChange('Month')}
                >
                  Month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a className="flex items-center border-2 px-2 rounded-md h-7">
              <IoMdSettings />
            </a>
          </div>
        </div>
        <hr className="mt-1 mb-2 w-ful" />
        {calendarView === 'Week' ? (
          <OnlyShownWeekTask date={startDate} />
        ) : (
          <OnlyShownMonthCalendar month={month} year={year} />
        )}
        <ChatAI />
      </div>
      {/* <button className="right-6 bottom-4 z-[100] absolute flex justify-center items-center bg-gradient-to-r from-indigo-500 to-cyan-400 p-[2px] rounded-full w-10 h-10">
        <div className="flex justify-center items-center bg-white rounded-full w-full h-full">
          <p className="bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400 font-bold text-center text-transparent text-xl">✨</p>
        </div>
      </button> */}
    </div >
  );
}

export default Home;
