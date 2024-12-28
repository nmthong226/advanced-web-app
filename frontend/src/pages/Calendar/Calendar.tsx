import { useState } from 'react';

// Import icons
import { MdOutlineViewWeek } from "react-icons/md";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

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
      <div className='flex items-center space-x-2 bg-indigo-50 p-2 w-full h-full'>
        <SideBarTask />
        <div className='relative flex flex-col justify-center space-y-2 bg-white p-1 border rounded-lg w-[84%] h-full'>
          <div className='flex justify-between items-center px-4 py-1'>
            <div className='flex'>
              <button className='font-semibold text-indigo-500 text-lg'>
                Task Calendar
                <span className='ml-2 font-normal text-gray-500'>|</span>
                <span className='ml-2 font-normal text-[12px] text-gray-500'>This section manages your tasks on track.</span>
              </button>
            </div>
            <ChatAI />
          </div>
          <hr className='border-[1px] my-2' />
          <div className='relative flex justify-between items-center px-4 text-[12px]'>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-[12px] text-gray-500">
                <p>Last update: <span className="font-medium text-gray-600">13/12/2024</span></p>
              </div>
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
              <button className='flex items-center border-2 px-2 py-1 rounded-md'>
                <HiOutlineCog6Tooth className='w-4 h-4' />
              </button>
              {isCalendarVisible && (
                <div className='top-10 right-0 z-50 absolute bg-gray-50 shadow-md p-2 border rounded-md'>
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
          </div>
          {/* Render calendar based on selected view */}
          {calendarView === 'Week' ? (
            <CalendarGrid date={startDate} />
          ) : (
            <MonthCalendar />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;
