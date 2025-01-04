import React from 'react';
import { useTimerContext } from './TimerContext';
import { formatTime } from './utils';

const TimerDisplay: React.FC = () => {
  const { time, isActive, setIsActive, selectedTask, handleModeChange, mode } =
    useTimerContext();

  const handleStartPause = () => {
    if (selectedTask) {
      setIsActive((prev) => !prev);
    } else {
      alert('Please select a task to start the timer.');
    }
  };

  const handleSkip = () => {
    if (!selectedTask) {
      alert('Please select a task to skip.');
      return;
    }

    if (mode === 'pomodoro') {
      handleModeChange('shortBreak');
    } else {
      handleModeChange('pomodoro');
    }

    setIsActive(false); // Pause timer when skipping
  };

  return (
    <div className="flex flex-col items-center">
      {/* Timer Display */}
      <p className="text-8xl font-semibold text-[#5f341f] mb-6">
        {formatTime(time)}
      </p>

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={handleStartPause}
          className={`px-6 py-3 rounded-md text-white ${
            mode === 'pomodoro'
              ? 'bg-red-600'
              : mode === 'shortBreak'
                ? 'bg-green-600'
                : 'bg-blue-600'
          } hover:opacity-90 transition`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;
