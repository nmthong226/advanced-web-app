//Import frameworks
import { useState } from 'react';

//Import icons
import { MdOutlineViewWeek } from "react-icons/md";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

//Import styles
import './style.css';

//Import components
import SideBarTask from '../../components/sidebar/sidebar_task.tsx';
import CalendarGrid from '../../components/draggable/CalendarGrid.tsx';

//Import libs/packages
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DayPilot, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { CalendarDaysIcon } from 'lucide-react';
import ChatAI from '../../components/AI/chatHistory.tsx';

const Calendar = () => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState('2024-12-08'); // Default date

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
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
            {/* AI Insights Button */}
            <ChatAI />
          </div>
          <hr className='border-[1px] my-2' />
          <div className='relative flex justify-between items-center px-4 text-[12px]'>
            <div className="flex items-center space-x-4">
              {/* Summary Text */}
              <div className="flex items-center text-[12px] text-gray-500">
                <p>Last update: <span className="font-medium text-gray-600">13/12/2024</span></p>
              </div>
            </div>
            <div className='flex space-x-3'>
              <button className='flex items-center border-2 px-2 py-1 rounded-md w-[110px]'>
                <MdOutlineViewWeek className='mr-2 w-4 h-4' />
                <p>Mode: Week</p>
              </button>
              <button
                className='flex items-center border-2 px-2 py-1 rounded-md'
                onClick={toggleCalendar}
              >
                <CalendarDaysIcon className='mr-2 w-4 h-4' />{' '}
                {/* Correct size classes */}
                <p>
                  <p>
                    {new DayPilot.Date(startDate).toString('dd')} -{' '}
                    {new DayPilot.Date(startDate)
                      .addDays(6)
                      .toString('dd MMM yy')}
                  </p>
                </p>
              </button>
              <button className='flex items-center border-2 px-2 py-1 rounded-md'>
                <HiOutlineCog6Tooth className='w-4 h-4' />
              </button>
              {/* Conditional rendering of the calendar */}
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
                      setIsCalendarVisible(false); // Hide calendar after selecting a date
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <CalendarGrid date={startDate} />
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;
