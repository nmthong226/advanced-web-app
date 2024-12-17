//Import frameworks
import { useState } from 'react';

//Import icons
import { BsCollection } from 'react-icons/bs';

//Import styles
import './style.css';

//Import components
import SideBarActivity from '../../components/sidebar/sidebar_activity.tsx';

//Import libs/packages
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DayPilot, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { CalendarDaysIcon } from 'lucide-react';
import TimeTableGrid from '../../components/draggable/TimetableGrid.tsx';

const TimeTable = () => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState('2024-12-08'); // Default date

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex items-center space-x-2 bg-indigo-50 p-2 w-full h-full'>
        <SideBarActivity />
        <div className='relative flex flex-col justify-center space-y-2 bg-white p-1 border rounded-lg w-[84%] h-full'>
          <div className='flex justify-start items-center px-2 py-1'>
            <div className='flex space-x-4'>
              <button className='px-2 font-semibold text-indigo-500 text-lg'>
                Timetable
                <span className='ml-2 font-normal text-gray-500'>|</span>
                <span className='ml-2 font-normal text-[12px] text-gray-500'>This section manages your daily activity calendar.</span>
              </button>
            </div>
          </div>
          <hr className='border-[1px] my-2' />
          <div className='relative flex justify-between items-center text-[12px]'>
            <div className="flex items-center space-x-4 ml-4">
              {/* AI Insights Button */}
              <button
                className="flex items-center border-[1px] border-gray-300 hover:bg-gray-100 px-2 py-1 rounded-md transition duration-200"
                title="Click to get AI-powered suggestions for optimizing your study plan"
              >
                <span className="text-base">💡</span>
                <span className="font-medium">AI Insights</span>
              </button>
              {/* Summary Text */}
              <div className="flex items-center text-[12px] text-gray-500">
                <p>Overall: <span className="font-medium text-gray-600">...</span></p>
                <span className="mx-3 text-gray-400">|</span>
                <p>Last update: <span className="font-medium text-gray-600">...</span></p>
              </div>
            </div>
            <div className='flex space-x-3 mr-4'>
              <button className='flex items-center border-2 px-2 py-1 rounded-md'>
                <BsCollection className='mr-2 w-4 h-4' />{' '}
                {/* Correct size classes */}
                <p>
                  <p>Preset 1</p>
                </p>
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

              {/* Conditional rendering of the calendar */}
              {isCalendarVisible && (
                <div className='top-10 z-50 absolute bg-gray-50 shadow-md p-2 border rounded-md'>
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
          <TimeTableGrid date={startDate}/>
        </div>
      </div>
    </DndProvider>
  );
};

export default TimeTable;
