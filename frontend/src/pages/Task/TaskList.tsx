import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DayPilotNavigator, DayPilot } from '@daypilot/daypilot-lite-react';
import { MdFilterAlt, MdMoreVert } from 'react-icons/md';
import { IoSearchSharp } from 'react-icons/io5';
import { CalendarDaysIcon } from 'lucide-react';
import {
  FaEye,
  FaEyeSlash,
  FaFire,
  FaExclamationTriangle,
  FaExclamationCircle,
} from 'react-icons/fa';
import SideBarActivity from '../../components/sidebar/sidebar_activity.tsx';
import { Button } from '../../components/ui/button.tsx';

const TaskList = () => {
  const [isOpenTask, setIsOpenTask] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState('2024-12-01');
  const [groupBy, setGroupBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumns, setShowColumns] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // Track active tab
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Game HW3',
      status: 'To-do',
      category: 'Game Development',
      deadline: '23:55, Dec 3',
      timeSpent: '2h',
      emergencyType: 'fire',
    },
    {
      id: 2,
      name: 'Math Assignment',
      status: 'Pending',
      category: 'Math',
      deadline: '22:00, Dec 4',
      timeSpent: '1.5h',
      emergencyType: 'warning',
    },
    {
      id: 3,
      name: 'History Presentation',
      status: 'Completed',
      category: 'History',
      deadline: '20:00, Dec 2',
      timeSpent: '3h',
      emergencyType: 'urgent',
    },
  ]);

  enum EmergencyType {
    Fire = 'fire',
    Warning = 'warning',
    Urgent = 'urgent',
  }

  const handleAddNewTask = (newTask: {
    name: string;
    status: string;
    category: string;
    deadline: string;
    timeSpent: string;
    emergencyType: EmergencyType;
  }) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: prevTasks.length + 1, ...newTask },
    ]);
  };

  const [newTask, setNewTask] = useState({
    name: '',
    status: 'To-do',
    category: '',
    deadline: '',
    timeSpent: '',
    emergencyType: EmergencyType.Fire,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
  ) => {
    setNewTask({
      ...newTask,
      [field]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddNewTask(newTask);
    setIsOpenTask(false);
  };

  const filterTasks = () => {
    return tasks.filter((task) => {
      const statusMatch = activeTab === 'All' || task.status === activeTab;
      const searchMatch = task.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  };

  const toggleCalendar = () => setIsCalendarVisible(!isCalendarVisible);
  const handleGroupChange = (group: string) => setGroupBy(group);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const toggleColumnsVisibility = () => setShowColumns(!showColumns);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-start w-full h-full">
        {/* Sidebar Activity */}
        <SideBarActivity />

        {/* Main Content */}
        <div className="flex flex-col p-1 w-[86%] h-full relative">
          <div className="flex px-8 py-1 justify-start items-center">
            <div className="flex space-x-8">
              <button className="text-indigo-500 text-lg font-semibold">
                Calendar
              </button>
              <button className="text-gray-700 text-lg font-semibold">
                Task List
              </button>
            </div>
            <div className="flex absolute right-0 space-x-4 p-0 px-4 m-0 items-center">
              <button className="py-1 px-4 bg-indigo-500 text-white rounded-md text-center">
                + Task
              </button>
            </div>
          </div>
          <hr className="my-2 border-[1px]" />
          <div className="flex justify-end space-x-4 mr-4 text-sm items-center relative">
            <button
              onClick={() => handleGroupChange('category')}
              className="flex px-2 py-1 border-2 rounded-md items-center"
            >
              <MdFilterAlt className="w-4 h-4 mr-2" />
              Group By
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border-2 rounded-md py-1 px-2"
              />
              <IoSearchSharp className="absolute right-2 top-2 w-4 h-4 text-gray-500" />
            </div>

            <button
              onClick={toggleColumnsVisibility}
              className="flex px-2 py-1 border-2 rounded-md items-center"
            >
              {showColumns ? (
                <FaEyeSlash className="w-4 h-4 mr-2" />
              ) : (
                <FaEye className="w-4 h-4 mr-2" />
              )}
              {showColumns ? 'Hide Columns' : 'Show Columns'}
            </button>

            <button
              className="flex px-2 py-1 border-2 rounded-md items-center"
              onClick={toggleCalendar}
            >
              <CalendarDaysIcon className="w-4 h-4 mr-2" />
              <p>
                {new DayPilot.Date(startDate).toString('dd')} -{' '}
                {new DayPilot.Date(startDate).addDays(6).toString('dd MMM yy')}
              </p>
            </button>
            {isCalendarVisible && (
              <div className="absolute z-50 top-10 bg-gray-50 border shadow-md p-2 rounded-md">
                <DayPilotNavigator
                  selectMode={'Week'}
                  showMonths={1}
                  skipMonths={1}
                  selectionDay={new DayPilot.Date(startDate)}
                  onTimeRangeSelected={(args) => {
                    setStartDate(
                      new DayPilot.Date(args.day).toString('yyyy-MM-dd'),
                    );
                    setIsCalendarVisible(false);
                  }}
                />
              </div>
            )}

            <button className="flex px-2 py-1 border-2 rounded-md items-center">
              <MdMoreVert className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between border-t mt-2 pt-2 px-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('All')}
                className={`py-1 px-3 rounded-md ${activeTab === 'All' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
              >
                All Task
              </button>
              <button
                onClick={() => setIsOpenTask(true)}
                className="py-1 px-3 rounded-md text-indigo-500 border border-indigo-500"
              >
                + Add New Task
              </button>
            </div>

            <div className="flex flex-row p-1 space-x-2 items-center bg-gray-100">
              <button
                onClick={() => setActiveTab('To-do')}
                className={`py-1 px-3 rounded-md text-[12px] font-semibold text-left ${activeTab === 'To-do' ? 'bg-white text-black' : 'bg-none'}`}
              >
                To-do
              </button>
              <button
                onClick={() => setActiveTab('Pending')}
                className={`py-1 px-3 rounded-md text-[12px] font-semibold text-left ${activeTab === 'Pending' ? 'bg-white text-black' : 'bg-none'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('Completed')}
                className={`py-1 px-3 rounded-md text-[12px] font-semibold text-left ${activeTab === 'Completed' ? 'bg-white text-black' : 'bg-none'}`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="px-4 border rounded-t-lg w-[97%] h-full justify-center mx-auto mt-4">
            <div className="flex justify-between items-center bg-gray-100 p-2 border-b rounded-t-md">
              <p className="w-[25%] text-[14px] font-semibold text-left">
                Name
              </p>
              <p className="w-[18%] text-[14px] font-semibold text-left">
                Status
              </p>
              <p className="w-[16%] text-[14px] font-semibold text-left">
                Category
              </p>
              <p className="w-[16%] text-[14px] font-semibold text-left">
                Deadline
              </p>
              <p className="w-[14%] text-[14px] font-semibold text-left">
                Time Spent
              </p>
              <p className="w-[11%] text-[14px] font-semibold text-left">
                Emergency
              </p>
            </div>

            {/* Task Rows */}
            {filterTasks().map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <p className="w-[25%] text-[14px] text-left">{task.name}</p>
                <p
                  className={`w-[18%] text-[14px] text-left ${
                    task.status === 'Completed'
                      ? 'text-green-600'
                      : task.status === 'Pending'
                        ? 'text-yellow-500'
                        : 'text-gray-600'
                  }`}
                >
                  {task.status}
                </p>
                <p className="w-[16%] text-[14px] text-left">{task.category}</p>
                <p className="w-[16%] text-[14px] text-left">{task.deadline}</p>
                <p className="w-[14%] text-[14px] text-left">
                  {task.timeSpent}
                </p>
                <div className="w-[11%] text-left flex items-center space-x-2">
                  {task.emergencyType === 'fire' && (
                    <FaFire className="text-red-500" />
                  )}
                  {task.emergencyType === 'warning' && (
                    <FaExclamationTriangle className="text-yellow-500" />
                  )}
                  {task.emergencyType === 'urgent' && (
                    <FaExclamationCircle className="text-orange-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Modal */}
        {isOpenTask && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md shadow-lg w-[80%] md:w-[40%]">
              <h3 className="font-semibold mb-4 text-xl">Add New Task</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newTask.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    className="w-full border-2 rounded-md p-2"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label>Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => handleInputChange(e, 'status')}
                    className="w-full border-2 rounded-md p-2"
                  >
                    <option value="To-do">To-do</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label>Category</label>
                  <input
                    type="text"
                    value={newTask.category}
                    onChange={(e) => handleInputChange(e, 'category')}
                    className="w-full border-2 rounded-md p-2"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label>Deadline</label>
                  <input
                    type="text"
                    value={newTask.deadline}
                    onChange={(e) => handleInputChange(e, 'deadline')}
                    className="w-full border-2 rounded-md p-2"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label>Time Spent</label>
                  <input
                    type="text"
                    value={newTask.timeSpent}
                    onChange={(e) => handleInputChange(e, 'timeSpent')}
                    className="w-full border-2 rounded-md p-2"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label>Emergency Type</label>
                  <select
                    value={newTask.emergencyType}
                    onChange={(e) => handleInputChange(e, 'emergencyType')}
                    className="w-full border-2 rounded-md p-2"
                  >
                    <option value="fire">Fire</option>
                    <option value="warning">Warning</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="flex justify-between space-x-2 mt-4">
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-500 text-white rounded-md"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpenTask(false)}
                    className="py-2 px-4 border-2 rounded-md text-red-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default TaskList;
