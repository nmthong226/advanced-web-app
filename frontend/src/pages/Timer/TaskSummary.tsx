import React from 'react';
import { useTimerContext } from './TimerContext';

const TaskSummary: React.FC = () => {
  const { tasks, time, selectedTask } = useTimerContext();

  const totalPomodorosPlanned = tasks.reduce(
    (acc, task) => acc + task.estimatedTime,
    0,
  );
  const totalPomodorosCompleted = tasks.reduce(
    (acc, task) => acc + task.pomodorosCompleted,
    0,
  );

  const estimatedFinishTime = selectedTask
    ? new Date(new Date().getTime() + time * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  return (
    <div className="w-full max-w-md p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold text-[#5f341f] mb-4">Task Summary</h2>
      <p className="text-gray-700">
        <span className="font-semibold text-[#5f341f]">Pomodoros:</span>{' '}
        {totalPomodorosCompleted}/{totalPomodorosPlanned}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold text-[#5f341f]">
          Estimated Finish Time:
        </span>{' '}
        {estimatedFinishTime}
      </p>
    </div>
  );
};

export default TaskSummary;
