import React from 'react';
import { useTimerContext } from './TimerContext';

const TaskList: React.FC = () => {
  const { tasks, selectedTask, setSelectedTask } = useTimerContext();

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    setSelectedTask(task);
  };

  return (
    <div className="w-full max-w-md">
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              onClick={() => handleTaskSelect(task._id)}
              className={`p-4 bg-white shadow-md rounded-md cursor-pointer ${
                selectedTask?._id === task._id ? 'border-2 border-blue-500' : ''
              } hover:bg-gray-100 transition`}
            >
              <p className="font-bold text-lg">{task.title}</p>
              <p className="text-sm text-gray-500">{task.description}</p>
              <p className="text-sm font-semibold text-[#5f341f]">
                {task.pomodorosCompleted}/{task.estimatedTime}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
