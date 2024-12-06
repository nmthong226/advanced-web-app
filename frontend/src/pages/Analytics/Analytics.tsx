//Import icons
import { GiTomato } from "react-icons/gi";
import { IoCalendar } from "react-icons/io5";
import { TbClockHour3Filled } from "react-icons/tb";
import { RiFireFill } from "react-icons/ri";
import { BsListTask } from "react-icons/bs";

//Import components
import Chart from "../../components/charts/BarChart";
import TaskPieChart from "../../components/charts/PieChart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import WeeklyCategoryChart from "../../components/charts/StackChart";

const Analytics = () => {
    return (
        <div className="flex items-center space-x-2 bg-indigo-50 p-2 w-full h-full">
            <div className="flex flex-col space-y-2 w-[30%] h-full">
                <div className="flex flex-col bg-white p-2 rounded-md w-full h-[50%]">
                    {/* Pomodoro:
                    - Active days: number of days that user use pomo
                    - Spent hours: number of hour that user spent for pomodoro
                    - Day streaks: number of days in a row that user use pomodoro
                    - Line chart: number of pomodoro completed per day */}
                    <div className="flex items-center w-full h-[10%] font-semibold text-sm">
                        <GiTomato className="mr-2" />
                        <p>Pomodoro</p>
                    </div>
                    <div className="flex justify-center items-center space-x-4 w-full h-[20%]">
                        <div className="flex flex-col shadow-md p-1 border rounded-md w-1/3 h-14">
                            <div className="flex justify-between items-center w-full h-full">
                                <IoCalendar className="size-6" />
                                <p className="font-bold font-sans text-lg leading-none">1</p>
                            </div>
                            <p className="text-right font-mono text-[12px]">Active days</p>
                        </div>
                        <div className="flex flex-col shadow-md p-1 border rounded-md w-1/3 h-14">
                            <div className="flex justify-between items-center w-full h-full">
                                <TbClockHour3Filled className="size-5" />
                                <p className="font-bold font-sans text-lg leading-none">12.3</p>
                            </div>
                            <p className="text-right font-mono text-[12px]">Spent hours</p>
                        </div>
                        <div className="flex flex-col shadow-md p-1 border rounded-md w-1/3 h-14">
                            <div className="flex justify-between items-center w-full h-full">
                                <RiFireFill className="size-5" />
                                <p className="font-bold font-sans text-lg leading-none">7</p>
                            </div>
                            <p className="text-right font-mono text-[12px]">Day streaks</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center p-2 border rounded-md w-full h-[70%]">
                        <span className="m-2 font-semibold text-sm">Focus Hours</span>
                        <Chart />
                    </div>
                </div>
                <div className="flex flex-col space-y-2 bg-white p-2 rounded-md w-full h-[50%]">
                    {/* - Task: pie chart display the number of task completed, in progress, and pending */}
                    <div className="flex justify-between items-center h-[10%]">
                        <div className="flex items-center font-semibold text-sm">
                            <BsListTask className="mr-2" />
                            <p>Task's Analytics</p>
                        </div>
                        <Select value="task">
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="right-[20%]">
                                <SelectItem value="task">
                                    <div className="flex items-center text-[12px]">
                                        <BsListTask className="mr-1 size-3" />
                                        Task
                                    </div>
                                </SelectItem>
                                <SelectItem value="pomo">
                                    <div className="flex items-center text-[12px]">
                                        <GiTomato className="mr-1 size-3" />
                                        Pomo
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col justify-center p-2 border rounded-md w-full h-[90%]">
                        <TaskPieChart />
                    </div>
                </div>
            </div>
            <div className="flex flex-col space-y-2 w-[45%] h-full">
                <div className="flex bg-white rounded-md w-full h-[50%]">
                    {/* - Schedule: display the number of hour spent per category, per weeks, per month */}
                    <WeeklyCategoryChart />
                </div>
                <div className="flex bg-white rounded-md w-full h-[50%]"></div>
            </div>
            <div className="flex flex-col space-y-2 w-[25%] h-full">
                <div className="flex bg-white rounded-md w-full h-[30%]">
                    - showing the top categories
                </div>
                <div className="flex bg-white rounded-md w-full h-[70%]">Chat bot for commenting on analysis</div>
            </div>
        </div>
    )
}

export default Analytics