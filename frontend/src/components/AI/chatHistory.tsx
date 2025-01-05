import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import MessageInput from '../../components/AI/chatInput.tsx';
import axios from 'axios';
// import { tasks } from './mock-data-ai.tsx';
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';

const ChatAI = () => {
  const { tasks } = useTaskContext();
  const [messageInput, setMessageInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<
    Array<{ type: string; message: string }>
  >([]);

  const analyzeSchedule = async (
    userId: string,
    tasks: any[],
    user_prompt: string,
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/ai-feedbacks/analyze-schedule`,
        {
          userId,
          tasks: tasks,
          user_prompt,
        },
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      // Handle any errors
      console.error('Error analyzing schedule:', error);
    }
  };

  const sendMessage = async () => {
    if (messageInput.trim() !== '') {
      const newMessage = { type: 'user', message: messageInput };

      // Add user message to chat history
      setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);
      setMessageInput('');

      const aiResponse = await analyzeSchedule(
        'userid-1',
        tasks,
        newMessage.message,
      );

      if (aiResponse && aiResponse.feedback) {
        const botMessage = { type: 'ai', message: aiResponse.feedback };
        setChatHistory((prevChatHistory) => [...prevChatHistory, botMessage]);
      }
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="right-3 bottom-3 z-50 absolute flex justify-center items-center bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-xl p-[1px] rounded-full w-12 h-12">
          <div className="flex justify-center items-center bg-white dark:bg-gradient-to-b dark:from-indigo-600 dark:to-cyan-300 rounded-full w-11 h-11">
            <p className="font-bold text-2xl text-center">🤖</p>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-gradient-to-t from-indigo-50 to-white rounded-l-[26px] sm:max-w-[450px] md:max-w-[500px] h-full">
        <SheetHeader className="flex leading-tight">
          <SheetTitle>💡 AI Insights</SheetTitle>
          <SheetDescription className="text-xs">
            Review your task calendar and provide suggestions to optimize your
            plan.
            <hr className="border-gray-300 my-2 w-full" />
          </SheetDescription>
        </SheetHeader>
        {/* Chatbot UI */}
        <div className="flex custom-scrollbar px-1 h-[74%] overflow-y-scroll">
          {/* Chat Messages Container */}
          <div className="space-y-4">
            {/* AI Message */}
            <div className="flex items-start">
              <div className="bg-white shadow-md p-2 rounded-2xl max-w-[80%] text-gray-900 text-sm">
                <p>
                  Hello! I'm here to assist you in optimizing your schedule. How
                  can I help?
                </p>
              </div>
            </div>
            {/* User Message */}
            <div className="flex justify-end items-end">
              <div className="bg-blue-600 shadow-md p-2 rounded-2xl max-w-[80%] text-sm text-white">
                <p>Can you suggest how to prioritize my tasks for today?</p>
              </div>
            </div>
            {/* AI Message */}
            <div className="flex items-start">
              <div className="bg-white shadow-md p-2 rounded-2xl max-w-[80%] text-gray-900 text-sm">
                <p>
                  Sure! I recommend focusing on the high-priority tasks first,
                  like "Homework HW3." Would you like me to rearrange your
                  schedule?
                </p>
              </div>
            </div>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} ${chat.type === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`${chat.type === 'user' ? 'bg-blue-600' : 'bg-white'} shadow-md p-2 rounded-2xl max-w-[80%] text-${chat.type === 'user' ? 'white' : 'gray-900'} text-sm`}
                >
                  <p>{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat Input */}
        <MessageInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatAI;
