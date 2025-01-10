import { useEffect, useState, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import MessageInput from '../../components/AI/chatInput.tsx';
import { AIMessage, chatWithAiAgent } from '@/api/ai-agent.api.ts';
import { useAuth } from '@clerk/clerk-react';
import { getUserAPI } from '@/api/users.api.ts';
import { useTaskContext } from '@/contexts/UserTaskContext.tsx';
import { getTasksByUserId } from '@/api/tasks.api.ts';

interface UserInfo {
  userId: string; // User ID (required)
  userRole: string; // User role (e.g., 'admin', 'user', 'premium')
  email?: string; // Optional email
  fullName?: string; // Optional full name
  [key: string]: any; // Allow additional properties if needed
}

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
  timestamp: string; // ISO string for easy storage
}

const ChatAI = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { userId } = useAuth();
  const { setTasks } = useTaskContext();

  // Reference to the end of the messages list for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user information on component mount or when userId changes
  useEffect(() => {
    const getUser = async () => {
      try {
        if (!userId) return;
        const response = await getUserAPI(userId);
        if (response && response.userId) {
          setUserInfo(response);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    getUser();
  }, [userId]);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory) {
      try {
        const parsedHistory: ChatMessage[] = JSON.parse(storedChatHistory);
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing stored chat history:', error);
        localStorage.removeItem('chatHistory'); // Clear invalid data
      }
    }
  }, []);

  // Save chat history to localStorage and auto-scroll on updates
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    // Auto-scroll to the latest message whenever chatHistory updates
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Function to send a message
  const sendMessage = async () => {
    if (messageInput.trim() === '') return;

    const userMessage: ChatMessage = {
      sender: 'user',
      message: messageInput,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessageInput('');

    console.log('User sent message:', messageInput);

    try {
      // Validate user ID and user information
      if ((!userId && typeof userId !== 'string') || !userInfo) {
        alert('User ID is invalid');
        return;
      }

      const payload: AIMessage = {
        userId,
        userRole: userInfo.userRole,
        prompt: messageInput,
        preferredModel: 'gemini',
      };
      console.log('payload', payload);

      const response: any = await chatWithAiAgent(payload);
      console.log('response from AI agent', response);

      if (response && response.response) {
        const aiMessage: ChatMessage = {
          sender: 'ai',
          message: response.response,
          timestamp: new Date().toISOString(),
        };
        setChatHistory((prev) => [...prev, aiMessage]);

        // Refresh tasks
        const newTasks = await getTasksByUserId(userId);
        setTasks(newTasks);
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      // Optionally, add an error message to the chat history
      const errorMessage: ChatMessage = {
        sender: 'ai',
        message: error?.response?.data
          ? error.response.data.message
          : 'Something went wrong',
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open Chat"
          className="right-10 bottom-4 z-50 fixed flex justify-center items-center bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-xl p-[1px] rounded-full w-14 h-14 transform transition-transform hover:scale-105"
        >
          <div className="flex justify-center items-center bg-white dark:bg-gradient-to-b dark:from-indigo-600 dark:to-cyan-300 rounded-full w-12 h-12">
            <span role="img" aria-label="Robot" className="text-2xl">
              🤖
            </span>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-gradient-to-t from-indigo-50 to-white shadow-lg rounded-l-[26px] sm:max-w-[450px] md:max-w-[500px] h-full">
        <SheetHeader className="flex flex-col border-gray-200 p-3">
          <SheetTitle className="font-semibold text-indigo-700 text-xl">
            💡 Your AI Assistant
          </SheetTitle>
          <SheetDescription className="mt-1 text-gray-600 text-sm">
            Your assistant is here to help you. Feel free to ask anything.
            <hr className="border-gray-300 my-2 w-full" />
          </SheetDescription>
        </SheetHeader>

        {/* Chat Messages Container */}
        <div className="flex-1 custom-scrollbar px-4 overflow-x-hidden overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {/* Render Chat History */}
            {chatHistory.length === 0 && (
              <div className="flex items-start">
                <div className="bg-white shadow-md p-3 rounded-2xl max-w-[80%] text-gray-900 text-sm">
                  <p>Hello! I'm your assistant. How can I help you?</p>
                </div>
              </div>
            )}
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  chat.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {chat.sender === 'ai' && (
                  <img
                    src="https://robohash.org/mail@ashallendesign.co.uk"
                    // Replace with actual assistant avatar path
                    alt="Assistant Avatar"
                    className="mr-2 rounded-full w-8 h-8"
                  />
                )}

                <div className={`max-w-[70%]`}>
                  <div
                    className={`flex items-center p-3 rounded-2xl text-sm ${
                      chat.sender === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-white text-gray-900 shadow-md'
                    }`}
                  >
                    <p>{chat.message}</p>
                  </div>
                  <span
                    className={`text-xs text-gray-500 mt-1 block ${
                      chat.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {new Date(chat.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {chat.sender === 'user' && (
                  <img
                    src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250" // Replace with actual user avatar path or use a placeholder
                    alt="User Avatar"
                    className="ml-2 rounded-full w-8 h-8"
                  />
                )}
              </div>
            ))}

            {/* Dummy div to ensure scrolling to the latest message */}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Chat Input */}
        <div className="border-gray-200 bg-gray-50 p-4 border-t">
          <MessageInput
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            sendMessage={sendMessage}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatAI;
