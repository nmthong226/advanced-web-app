//Import frameworks
import { useState } from 'react';

//Import icons

//Import styles
import './style.css';

//Import components
import SideBarTask from '../../components/sidebar/sidebar_task.tsx';
import CalendarGrid from '../../components/draggable/CalendarGrid.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import MessageInput from '../../components/AI/chatInput.tsx';

//Import libs/packages
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DayPilot, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { CalendarDaysIcon } from 'lucide-react';

const Calendar = () => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState('2024-12-08'); // Default date

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
  };

  const [messageInput, setMessageInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{ type: string; message: string }>>([]); // Chat history state

  console.log(chatHistory);
  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = { type: 'user', message: messageInput };

      // Add user message to chat history
      setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);
      setMessageInput(""); // Clear the input after sending

      // Simulate AI response after a delay
      setTimeout(() => {
        const aiResponse = {
          type: 'ai',
          message: "Sure! I recommend focusing on the high-priority tasks first, like 'Homework HW3.' Would you like me to rearrange your schedule?",
        };

        // Add AI response to chat history
        setChatHistory((prevChatHistory) => [...prevChatHistory, aiResponse]);
      }, 1000); // Delay for AI response
    }
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
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex items-center border-[1px] border-gray-300 hover:bg-gray-100 px-2 py-1 rounded-md transition duration-200"
                  title="Click to get AI-powered suggestions for optimizing your study plan"
                >
                  <span className="text-base">💡</span>
                  <span className="font-medium">AI Insights</span>
                </button>
              </SheetTrigger>
              <SheetContent className="flex flex-col bg-white sm:max-w-[450px] md:max-w-[500px] h-full">
                <SheetHeader className='flex leading-tight'>
                  <SheetTitle>💡 AI Insights</SheetTitle>
                  <SheetDescription className='text-xs'>
                    Review your task calendar and provide suggestions to optimize your plan.
                    <hr className="border-gray-300 my-2 w-full" />
                  </SheetDescription>
                </SheetHeader>
                {/* Chatbot UI */}
                <div className="flex custom-scrollbar px-1 h-[74%] overflow-y-scroll">
                  {/* Chat Messages Container */}
                  <div className="space-y-4">
                    {/* AI Message */}
                    <div className="flex items-start">
                      <div className="bg-gray-100 shadow-sm p-2 rounded-lg max-w-[80%] text-gray-900 text-sm">
                        <p>Hello! I'm here to assist you in optimizing your schedule. How can I help?</p>
                      </div>
                    </div>
                    {/* User Message */}
                    <div className="flex justify-end items-end">
                      <div className="bg-blue-600 shadow-sm p-2 rounded-lg max-w-[80%] text-sm text-white">
                        <p>Can you suggest how to prioritize my tasks for today?</p>
                      </div>
                    </div>
                    {/* AI Message */}
                    <div className="flex items-start">
                      <div className="bg-gray-100 shadow-sm p-2 rounded-lg max-w-[80%] text-gray-900 text-sm">
                        <p>Sure! I recommend focusing on the high-priority tasks first, like "Homework HW3." Would you like me to rearrange your schedule?</p>
                      </div>
                    </div>
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} ${chat.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`bg-${chat.type === 'user' ? 'blue-600' : 'gray-100'} shadow-sm p-2 rounded-lg max-w-[80%] text-${chat.type === 'user' ? 'white' : 'gray-900'} text-sm`}>
                          <p>{chat.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Chat Input */}
                <hr className="border-gray-300 w-full" />
                <MessageInput messageInput={messageInput} setMessageInput={setMessageInput} sendMessage={sendMessage} />
              </SheetContent>
            </Sheet>
          </div>
          <hr className='border-[1px] my-2' />
          <div className='relative flex justify-between items-center px-4 text-[12px]'>
            <div className="flex items-center space-x-4">
              {/* Summary Text */}
              <div className="flex items-center text-[12px] text-gray-500">
                <p>Overall: <span className="font-medium text-gray-600">...</span></p>
                <span className="mx-3 text-gray-400">|</span>
                <p>Last update: <span className="font-medium text-gray-600">...</span></p>
              </div>
            </div>
            <div className='flex space-x-3'>
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
