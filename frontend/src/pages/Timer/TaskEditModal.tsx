import React, { useState } from 'react';
import { useTimerContext } from './TimerContext';

interface TaskEditModalProps {
  taskId: string;
  onClose: () => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ taskId, onClose }) => {
  const { tasks, setTasks, selectedTask, setSelectedTask } = useTimerContext();
  const [error, setError] = useState<string | null>(null);

  // Find the task to edit
  const task = tasks.find((t) => t._id === taskId);
  if (!task) {
    return null;
  }

  const [title, setTitle] = useState(task.title);
  const [estimatedTime, setEstimatedTime] = useState(task.estimatedTime);

  // Handle saving changes
  const handleSave = () => {
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t._id === taskId ? { ...t, title: title.trim(), estimatedTime } : t,
      ),
    );

    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask({
        ...selectedTask,
        title: title.trim(),
        estimatedTime,
      });
    }

    setError(null);
    onClose();
  };

  // Handle task deletion
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?',
    );
    if (!confirmDelete) return;

    setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask(null); // Deselect task if it's the one being deleted
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#5f341f]">
          Edit Task
        </h2>

        {/* Task Title Input */}
        <div className="mb-4">
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700"
          >
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#5f341f] focus:border-[#5f341f]"
          />
        </div>

        {/* Estimated Pomodoros Input */}
        <div className="mb-4">
          <label
            htmlFor="estimated-time"
            className="block text-sm font-medium text-gray-700"
          >
            Estimated Pomodoros
          </label>
          <div className="flex items-center mt-1">
            <button
              type="button"
              onClick={() => setEstimatedTime(Math.max(1, estimatedTime - 1))}
              className="px-3 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300 transition"
            >
              -
            </button>
            <input
              id="estimated-time"
              type="number"
              value={estimatedTime}
              onChange={(e) =>
                setEstimatedTime(Math.max(1, Number(e.target.value)))
              }
              min="1"
              className="w-16 text-center border-t border-b border-gray-300 focus:ring-[#5f341f] rounded-none"
            />
            <button
              type="button"
              onClick={() => setEstimatedTime(estimatedTime + 1)}
              className="px-3 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
