//Import frameworks
import { useEffect, useRef, useState } from "react";

//Import libs/packages
import { DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import dayjs from 'dayjs';

//Import components
import OnlyShownTimeTable from "../../components/onlyshownschedule/OnlyShownTimeTable";
import Chart from "../../components/charts/BarChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import OnlyShownTaskSchedule from "../../components/onlyshownschedule/OnlyShownTaskSchedule";

//Import icons
import { BsCollection } from "react-icons/bs";
import { CalendarDaysIcon } from "lucide-react";
import { BsListTask } from "react-icons/bs";
import { GiTomato } from "react-icons/gi";
import { FaCheck } from "react-icons/fa6";
import { RiRestTimeLine } from "react-icons/ri";
import { IoMdMore } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";

//Import contexts
import { useSettings } from "../../contexts/SettingsContext";

const Home = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isMorning, setIsMorning] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>("Good Morning");

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState("2024-12-01"); // Default date
  const { settings, showLeftBar } = useSettings();

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

  const table1Ref = useRef(null);
  const table2Ref = useRef(null);

  const syncScroll = (sourceRef: React.RefObject<HTMLElement>, targetRef: React.RefObject<HTMLElement>) => {
    // Ensure both refs are valid before accessing the scroll properties
    if (sourceRef.current && targetRef.current) {
        // Synchronize the scroll positions of the source and target elements
        targetRef.current.scrollTop = sourceRef.current.scrollTop;
        targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    } else {
        console.warn('Both source and target refs must be valid to synchronize scroll.');
    }
};

  return (
    <div className="flex items-center space-x-2 bg-indigo-50 p-2 w-full h-full overflow-y-hidden">
      {showLeftBar && (
        <div className="flex flex-col space-y-4 w-[30%] h-full">
          {/*Show greetings*/}
          {settings.showGreetings && (
            <div className="flex flex-col bg-white shadow-md p-1 rounded-lg w-full h-[10%]">
              <div
                className={`flex flex-col w-full h-full border rounded-lg items-start justify-center pl-4 
          ${isMorning ? 'bg-gradient-to-b from-sky-400 to-indigo-100' : 'bg-gradient-to-b from-purple-400 to-indigo-100'}`}
              >
                <p className="font-semibold text-sm text-zinc-600">{currentTime}</p>
                <p className="font-bold text-lg text-zinc-700">{greeting}, Minh Thong</p>
              </div>
            </div>
          )}
          {/*Upcoming task or activity*/}
          {settings.showUpcoming && (
            <div className="flex flex-col bg-white shadow-md p-1 rounded-lg w-full h-[15%]">
              <div className="flex flex-col justify-start w-full">
                <div className="flex justify-between items-center border-b">
                  <p className="m-2 font-semibold text-sm">Your Upcoming</p>
                  <div className="flex space-x-1 text-[12px]">
                    <button className="px-1.5 border rounded-sm w-14">Activity</button>
                    <button className="px-1.5 border rounded-sm w-14">Task</button>
                  </div>
                </div>
                <div className="flex justify-between items-center space-x-0.5 border-purple-500 bg-purple-100 mt-1 p-1 border-l-4 w-full h-10">
                  <p className="m-2 w-[25%] font-mono font-semibold text-left text-sm text-zinc-600 truncate">Stand up</p>
                  <p className="ml-2 w-[17%] font-mono text-left text-sm text-zinc-600 truncate">9-10 AM</p>
                  <p className="ml-2 w-[15%] font-mono text-sm text-zinc-600 truncate">21 Dec</p>
                  <p className="ml-2 w-[20%] font-mono text-sm text-zinc-600 truncate">Courses</p>
                  <p className="m-2 w-[20%] font-mono text-sm text-zinc-600">⌛10 min</p>
                  <button className="w-[3%]">
                    <IoMdMore />
                  </button>
                </div>
                <div className="mt-1 font-mono text-[12px] text-center hover:underline italic hover:cursor-pointer">and 2 more...</div>
              </div>
            </div>
          )}
          {/*Task Overview*/}
          {settings.showTaskOverview && (
            <div className="flex flex-col justify-between bg-white shadow-md p-1 rounded-lg w-full h-[40%]">
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
                  <div className="flex justify-between items-center space-x-2 p-1 border rounded-md w-full h-10">
                    <p className="w-[23%] text-[12px] text-left truncate">🔥Game HW3</p>
                    <div className="flex items-center w-[18%] text-[12px] text-left truncate">
                      <div className="bg-slate-400 mr-0.5 rounded-full w-3 h-3" />
                      <p>To-do</p>
                    </div>
                    <p className="w-[16%] text-[12px] text-left truncate">Game Development</p>
                    <p className="w-[18%] text-[12px] text-left truncate">23:55, Dec 3</p>
                    <p className="w-[6%] text-[12px] text-left">2h</p>
                    <button className="w-[3%]">
                      <IoMdMore />
                    </button>
                  </div>
                  <div className="flex justify-between items-center space-x-2 p-1 border rounded-md w-full h-10">
                    <p className="w-[23%] text-[12px] text-left truncate">⚡Seminar Presentation</p>
                    <div className="flex items-center w-[18%] text-[12px] text-left truncate">
                      <div className="border-[1px] border-slate-300 bg-zinc-50 mr-0.5 rounded-full w-3 h-3" />
                      <p>Completed</p>
                    </div>
                    <p className="w-[16%] text-[12px] text-left truncate">Advanced Web Application Development</p>
                    <p className="w-[18%] text-[12px] text-left truncate">14:30, Dec 14</p>
                    <p className="w-[6%] text-[12px] text-left truncate">3h</p>
                    <button className="w-[3%]">
                      <IoMdMore />
                    </button>
                  </div>
                  <div className="flex justify-between items-center space-x-2 p-1 border rounded-md w-full h-10">
                    <p className="w-[23%] text-[12px] text-left truncate">🌀Data HW3: Analyze</p>
                    <div className="flex items-center w-[18%] text-[12px] text-left truncate">
                      <div className="bg-slate-300 mr-0.5 rounded-full w-3 h-3" />
                      <p>Pending</p>
                    </div>
                    <p className="w-[16%] text-[12px] text-left truncate">Intro2DS</p>
                    <p className="w-[18%] text-[12px] text-left truncate">22:00, Dec 12</p>
                    <p className="w-[6%] text-[12px] text-left truncate">3h</p>
                    <button className="w-[3%]">
                      <IoMdMore />
                    </button>
                  </div>
                  <div className="flex justify-between items-center space-x-2 p-1 border rounded-md w-full h-10">
                    <p className="w-[23%] text-[12px] text-left truncate">🔥Data Examination</p>
                    <div className="flex items-center w-[18%] text-[12px] text-left truncate">
                      <div className="bg-slate-300 mr-0.5 rounded-full w-3 h-3" />
                      <p>Pending</p>
                    </div>
                    <p className="w-[16%] text-[12px] text-left truncate">Intro2DS</p>
                    <p className="w-[18%] text-[12px] text-left truncate">23:55, Dec 23</p>
                    <p className="w-[6%] text-[12px] text-left truncate">3h</p>
                    <button className="w-[3%]">
                      <IoMdMore />
                    </button>
                  </div>
                  <div className="flex justify-between items-center space-x-2 p-1 border rounded-md w-full h-10">
                    <p className="w-[23%] text-[12px] text-left truncate">🌀Feed the cat</p>
                    <div className="flex items-center w-[18%] text-[12px] text-left truncate">
                      <div className="border-[1px] border-slate-300 bg-zinc-50 mr-0.5 rounded-full w-3 h-3" />
                      <p>Completed</p>
                    </div>
                    <p className="w-[16%] text-[12px] text-left truncate">Chores</p>
                    <p className="w-[18%] text-[12px] text-left truncate">23:00, Dec 12</p>
                    <p className="w-[6%] text-[12px] text-left truncate">3h</p>
                    <button className="w-[3%]">
                      <IoMdMore />
                    </button>
                  </div>
                  <div className="flex justify-between items-center space-x-2 p-1 border rounded-md w-full h-10">
                    <p className="w-[23%] text-[12px] text-left truncate">⚡Buy junk food</p>
                    <div className="flex items-center w-[18%] text-[12px] text-left truncate">
                      <div className="bg-slate-400 mr-0.5 rounded-full w-3 h-3" />
                      <p>To-do</p>
                    </div>
                    <p className="w-[16%] text-[12px] text-left truncate">Chores</p>
                    <p className="w-[18%] text-[12px] text-left truncate">23:00, Dec 26</p>
                    <p className="w-[6%] text-[12px] text-left truncate">1.5h</p>
                    <button className="w-[3%]">
                      <IoMdMore />
                    </button>
                  </div>
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
            <div className="flex flex-col justify-between bg-white shadow-md p-1 rounded-lg w-full h-[30%]">
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
      <div className={`relative flex flex-col space-y-1 bg-white shadow-md p-1 rounded-lg ${showLeftBar ? 'w-[70%]' : 'w-full'} h-full`}>
        <div className="flex flex-row justify-between p-1">
          <p className="border-2 px-2 rounded-sm font-semibold text-md">✨ AI: Drink water to stay focused</p>
          <div className="relative flex justify-end items-center space-x-4 text-sm">
            <button
              className="flex items-center border-2 px-2 rounded-md h-7"
            >
              <BsCollection className="mr-2 w-4 h-4" /> {/* Correct size classes */}
              <p>
                <p>
                  Preset 1
                </p>
              </p>
            </button>
            <button
              className="flex items-center border-2 px-2 rounded-md h-7"
              onClick={toggleCalendar}
            >
              <CalendarDaysIcon className="mr-2 w-4 h-4" /> {/* Correct size classes */}
              <p>
                <p>
                  {new DayPilot.Date(startDate).toString("dd")} -{" "}
                  {new DayPilot.Date(startDate).addDays(6).toString("dd MMM yy")}
                </p>
              </p>
            </button>
            <a className="flex items-center border-2 px-2 rounded-md h-7">
              <IoMdSettings />
            </a>
            {/* Conditional rendering of the calendar */}
            {isCalendarVisible && (
              <div className="top-10 z-50 absolute bg-gray-50 shadow-md p-2 border rounded-md">
                <DayPilotNavigator
                  selectMode={"Week"}
                  showMonths={1}
                  skipMonths={1}
                  selectionDay={new DayPilot.Date(startDate)}
                  onTimeRangeSelected={(args) => {
                    setStartDate(new DayPilot.Date(args.day).toString("yyyy-MM-dd"));
                    setIsCalendarVisible(false); // Hide calendar after selecting a date
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <hr className="w-full" />
        <OnlyShownTimeTable
          ref={table1Ref}
          className="top-12 left-0 absolute h-[92%]"
          tableClassName=""
        />
        {/* <OnlyShownTaskSchedule
          ref={table2Ref}
          className="top-12 left-0 absolute h-[92%]"
          tableClassName="opacity-0"
          onScroll={() => syncScroll(table1Ref, table2Ref)}
        /> */}
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
