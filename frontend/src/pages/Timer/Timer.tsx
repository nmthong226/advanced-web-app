import React, { useState } from 'react';
import TimerDisplay from './TimerDisplay';
import TaskList from './TaskList';
import TaskSummary from './TaskSummary';
import TaskAddModal from './TaskAddModal';
import { TimerProvider } from './TimerContext';

const Timer: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddTaskModal = () => setIsAddModalOpen(true);
  const closeAddTaskModal = () => setIsAddModalOpen(false);

  return (
    <TimerProvider>
      <div className="flex flex-col w-full min-h-screen bg-gray-50 relative">
        <div className="flex flex-col items-center w-full">
          {/* Header */}
          <div className="flex w-full justify-center py-4 bg-white shadow">
            <h1 className="text-2xl font-bold text-[#5f341f]">
              Pomodoro Timer
            </h1>
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center mt-8 w-full px-4">
            <TimerDisplay />
          </div>

          {/* Task Summary */}
          <div className="flex flex-col items-center mt-4 w-full px-4">
            <TaskSummary />
          </div>

          {/* Task List */}
          <div className="flex flex-col items-center mt-6 w-full px-4">
            <div className="flex w-full max-w-md justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#5f341f]">Tasks</h2>
              <button
                onClick={openAddTaskModal}
                className="px-4 py-2 bg-[#5f341f] text-white rounded-md hover:bg-[#793d2b] transition"
              >
                Add Task
              </button>
            </div>
            <TaskList />
          </div>

          {/* Add Task Modal */}
          {isAddModalOpen && <TaskAddModal onClose={closeAddTaskModal} />}
        </div>
      </div>
    </TimerProvider>
  );
};

export default Timer;
