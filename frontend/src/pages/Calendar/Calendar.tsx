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
  const [calendarView, setCalendarView] = useState<'Week' | 'Month'>('Week'); // State for calendar view
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    // Format the date as 'YYYY-MM-DD'
    return today.toISOString().split('T')[0];
  });

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
  };

  const handleViewChange = (view: 'Week' | 'Month') => {
    setCalendarView(view);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='relative flex items-center space-x-2 bg-indigo-50 p-2 w-full h-full'>
        <SideBarTask />
        <div className='relative flex flex-col justify-center bg-white p-1 border rounded-lg w-[84%] h-full'>
          <div className='flex flex-wrap justify-between items-center p-2'>
            <div className='flex items-center'>
              <button className='font-semibold text-indigo-500 text-lg'>
                Task Calendar
                <span className='ml-2 font-normal text-[12px] text-gray-500'>- This section manages your tasks on track.</span>
              </button>
            </div>
            <Link
              to="/task"
              className="flex items-center border-[1px] border-gray-300 bg-indigo-800 hover:bg-indigo-800/80 px-2 py-1 rounded-md text-white transition duration-200"
              title='Go to Task List'
            >
              <BsListTask className="mr-2" />
              <span className="font-medium">Task List</span>
            </Link>
          </div>
          <hr className="mb-2 w-full" />
          <div className='relative flex justify-between items-center px-2 text-[12px]'>
            <div className="flex items-center space-x-2">
              <div className='flex'>
                <div className='flex items-center border-2 p-1 rounded-l-md'>
                  <FaAngleLeft />
                </div>
                <div className='border-2 border-x-0 px-3 p-1'>
                  Today
                </div>
                <div className='flex items-center border-2 p-1 rounded-r-md'>
                  <FaAngleRight />
                </div>
              </div>
              <button
                className='flex items-center border-2 px-2 py-1 rounded-md'
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
                  <button className='flex items-center border-2 px-2 py-1 rounded-md w-[80px] outline-none'>
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

              <button className='flex items-center border-2 px-2 py-1 rounded-md'>
                <HiOutlineCog6Tooth className='w-4 h-4' />
              </button>
            </div>
          </div>
          {/* Render calendar based on selected view */}
          {calendarView === 'Week' ? (
            <CalendarGrid date={startDate} />
          ) : (
            <MonthCalendar month={11} year={2024} />
          )}
          <ChatAI />
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;
