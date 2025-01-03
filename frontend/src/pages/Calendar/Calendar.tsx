import { useState } from 'react';

// Import icons
import { MdOutlineViewWeek } from "react-icons/md";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { BsListTask } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// Import styles
import './style.css';

// Import components
import SideBarTask from '../../components/sidebar/sidebar_task.tsx';
import CalendarGrid from '../../components/draggable/Task/WeekMode/CalendarGrid.tsx';
import MonthCalendar from '../../components/draggable/Task/MonthMode/MonthCalendar.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

// Import libs/packages
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DayPilot, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { CalendarDaysIcon } from 'lucide-react';
import ChatAI from '../../components/AI/chatHistory.tsx';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
  };

  const [calendarView, setCalendarView] = useState<'Week' | 'Month'>('Week'); // State for calendar view
  const handleViewChange = (view: 'Week' | 'Month') => {
    setCalendarView(view);
  };

  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Week's starting date (YYYY-MM-DD)
  });
  const [month, setMonth] = useState(new Date().getMonth()); // 0-based index (0 = January)
  const [year, setYear] = useState(new Date().getFullYear());

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
    <DndProvider backend={HTML5Backend}>
      <div className='relative flex items-center space-x-2 bg-indigo-50 dark:bg-slate-800 p-2 w-full h-full'>
        <SideBarTask />
        <div className='relative flex flex-col justify-center bg-white dark:bg-slate-700 p-1 border rounded-lg w-[84%] h-full'>
          <div className='flex flex-wrap justify-between items-center p-2'>
            <div className='flex items-center'>
              <button className='font-semibold text-indigo-500 text-lg dark:text-indigo-400'>
                Task Calendar
                <span className='ml-2 font-normal text-[12px] text-gray-500 dark:text-gray-200'>- This section manages your tasks on track.</span>
              </button>
            </div>
            <Link
              to="/task"
              className="flex items-center border-[1px] hover:bg-indigo-100/80 px-2 py-1 rounded-md text-gray-800 dark:text-white transition duration-200"
              title='Go to Task List'
            >
              <BsListTask className="mr-2" />
              <span className="font-medium">Task List</span>
            </Link>
          </div>
          <hr className="w-full" />
          <div className='relative flex justify-between items-center my-3 px-2 text-[12px]'>
            <div className="flex items-center space-x-2">
              <div className="flex">
                <div
                  className="flex items-center border-[1px] p-1 rounded-l-md cursor-pointer"
                  onClick={handlePrevious}
                >
                  <FaAngleLeft />
                </div>
                <div
                  className="border-[1px] border-x-0 px-3 p-1 cursor-pointer"
                  onClick={handleToday}
                >
                  Today
                </div>
                <div
                  className="flex items-center border-[1px] p-1 rounded-r-md cursor-pointer"
                  onClick={handleNext}
                >
                  <FaAngleRight />
                </div>
              </div>
              <button
                className='flex items-center border-[1px] px-2 py-1 rounded-md'
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
                <div className='top-9 left-4 z-50 absolute bg-gray-50 shadow-md p-2 border rounded-md'>
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
            <div className='flex space-x-3'>
              <DropdownMenu>
                <DropdownMenuTrigger className='outline-none'>
                  <button className='flex items-center border-[1px] px-2 py-1 rounded-md w-[80px] outline-none'>
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

              <button className='flex items-center border-[1px] px-2 py-1 rounded-md'>
                <HiOutlineCog6Tooth className='w-4 h-4' />
              </button>
            </div>
          </div>
          {/* Render calendar based on selected view */}
          {calendarView === 'Week' ? (
            <CalendarGrid date={startDate} />
          ) : (
            <MonthCalendar month={month} year={year} />
          )}
          <ChatAI />
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;
