import React, { useState } from 'react';
import { useTimerContext } from './TimerContext';
interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  startTime?: string;
  endTime?: string;
  dueTime?: string;
  estimatedTime: number; // Estimated Pomodoros
  pomodorosCompleted: number; // Pomodoros Completed
  style: {
    backgroundColor: string;
    textColor: string;
  };
  isOnCalendar: boolean;
}
// Mock Data for Task Selection
const mockTasks: Task[] = [
  {
    _id: '1',
    userId: 'user123',
    title: 'Write blog post',
    description: 'Draft the new blog post on React hooks.',
    status: 'in-progress',
    priority: 'high',
    category: 'Work',
    startTime: new Date().toISOString(),
    endTime: new Date(new Date().getTime() + 1500 * 1000).toISOString(),
    dueTime: new Date(new Date().getTime() + 3600 * 1000).toISOString(),
    estimatedTime: 1,
    pomodorosCompleted: 0,
    style: {
      backgroundColor: '#FFCDD2',
      textColor: '#B71C1C',
    },
    isOnCalendar: true,
  },
  {
    _id: '2',
    userId: 'user123',
    title: 'Read a book',
    description: 'Finish reading "Clean Code" by Robert C. Martin.',
    status: 'pending',
    priority: 'medium',
    category: 'Personal',
    startTime: '',
    endTime: '',
    dueTime: new Date(new Date().getTime() + 7200 * 1000).toISOString(),
    estimatedTime: 2,
    pomodorosCompleted: 0,
    style: {
      backgroundColor: '#C8E6C9',
      textColor: '#1B5E20',
    },
    isOnCalendar: false,
  },
];

interface TaskAddModalProps {
  onClose: () => void;
}

const TaskAddModal: React.FC<TaskAddModalProps> = ({ onClose }) => {
  const { setSelectedTask, setTasks } = useTimerContext();
  const [error, setError] = useState<string | null>(null);

  const handleSelectTask = (taskId: string) => {
    const task = mockTasks.find((t) => t._id === taskId);
    if (!task) {
      setError('Task not found.');
      return;
    }

    setTasks((prevTasks) => {
      const existingTask = prevTasks.find((t) => t._id === task._id);
      if (!existingTask) {
        return [...prevTasks, task];
      }
      return prevTasks;
    });

    setSelectedTask(task);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 animate-slideIn">
        <h2 className="text-2xl font-semibold mb-4 text-[#5f341f]">
          Select a Task
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* List of Mock Tasks */}
        <ul className="space-y-2 max-h-60 overflow-auto">
          {mockTasks.map((task) => (
            <li
              key={task._id}
              onClick={() => handleSelectTask(task._id)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="selectedTask"
                className="form-radio h-5 w-5 text-[#5f341f]"
              />
              <div>
                <p className="font-bold text-gray-800">{task.title}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskAddModal;
