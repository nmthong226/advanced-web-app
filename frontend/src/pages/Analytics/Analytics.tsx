//Import icons
import { GiTomato } from "react-icons/gi";
import { IoCalendar } from "react-icons/io5";
import { TbClockHour3Filled } from "react-icons/tb";
import { RiFireFill } from "react-icons/ri";
import { BsListTask } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";

//Import components
import Chart from "../../components/charts/BarChart";
import TaskPieChart from "../../components/charts/PieChart";
import WeeklyCategoryChart from "../../components/charts/StackChart";
import WeeklyCategoryPercentageChart from "../../components/charts/HorizontalBarChart";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import AIFeedback from "../../components/AI/analytics";

//Import libs/packages
import { DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { useEffect, useState } from "react";
import { CalendarDaysIcon } from "lucide-react";
import TimeVsTaskCompletionChart from "../../components/charts/DoubleBarChart";
import { FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";
import { getAISummary } from "@/components/api/analytics";

const Analytics = () => {
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [startDate, setStartDate] = useState("2024-12-01"); // Default date
    const {userId} = useAuth();
    const [aiSummaryInsights, setAiSummaryInsights] = useState(() => {
        const cachedSummary = localStorage.getItem("aiSummaryInsights");
        return cachedSummary ? JSON.parse(cachedSummary) : null;
    });

    useEffect(() => {
        const getAiSummaryInsights = async () => {
            if (userId) {
                try {
                    const response = await getAISummary(userId);
                    if (response?.data) {
                        setAiSummaryInsights(response.data);
                        localStorage.setItem("aiSummaryInsights", JSON.stringify(response.data));
                    } else {
                        alert("Something went wrong while fetching AI summary insights.");
                    }
                } catch (error) {
                    console.error("Error fetching AI summary insights:", error);
                }
            }
        };

        if (!aiSummaryInsights) {
            getAiSummaryInsights();
        }
    }, [userId, aiSummaryInsights]);

    const toggleCalendar = () => {
        setIsCalendarVisible(!isCalendarVisible); // Toggle visibility
    };

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
                        <p className="mr-0.5">Pomodoro</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center hover:cursor-pointer">
                                        <AiFillInfoCircle className="text-gray-500/40 size-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white shadow-xl border text-muted-foreground text-zinc-700">
                                    <p>Track your Pomodoro productivity</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                    <div className="flex flex-col justify-center items-center border rounded-md w-full h-[70%]">
                        <span className="m-2 font-semibold text-sm">Pomofocus chart</span>
                        <div className="flex justify-center items-center w-[80%] h-[100%]">
                            <Chart />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-2 bg-white p-2 rounded-md w-full h-[50%]">
                    {/* - Task: pie chart display the number of task completed, in progress, and pending */}
                    <div className="relative flex justify-between items-center h-[10%]">
                        <div className="flex items-center font-semibold text-sm">
                            <BsListTask className="mr-2" />
                            <p className="mr-0.5">Task Status</p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center hover:cursor-pointer">
                                            <AiFillInfoCircle className="text-gray-500/40 size-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white shadow-xl border text-muted-foreground text-zinc-700">
                                        <p>Track your task's status</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex space-x-1">
                            <button
                                className="flex items-center border-2 px-2 py-1 rounded-md"
                                onClick={toggleCalendar}
                            >
                                <CalendarDaysIcon className="mr-2 w-4 h-4" /> {/* Correct size classes */}
                                <p className="text-[12px]">
                                    {new DayPilot.Date(startDate).toString("dd")} -{" "}
                                    {new DayPilot.Date(startDate).addDays(6).toString("dd MMM yy")}
                                </p>
                            </button>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="relative flex justify-center items-center bg-gradient-to-r from-indigo-500 to-cyan-400 p-[1px] rounded-full w-7 h-7">
                                        <div className="flex justify-center items-center bg-white rounded-full w-full h-full">
                                            <p className="bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400 font-bold text-center text-transparent">✨</p>
                                        </div>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Task Status</DialogTitle>
                                        <DialogDescription>
                                            Track your task's status
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col">
                                        <div className="flex justify-center p-2 border rounded-md w-full h-full">
                                            <TaskPieChart />
                                        </div>
                                        <div className="flex flex-col justify-start space-y-2 custom-scrollbar p-2 rounded-md w-full h-[200px] overflow-y-auto">
                                            <h5 className="flex items-center gap-1 font-mono font-semibold text-sm">
                                                ✨ AI Analysis
                                            </h5>
                                            <ul className="flex flex-col space-y-1 pl-5 text-[12px] list-disc">
                                                <li>
                                                    Pending Tasks: With 8 pending tasks (34.78%), it's important to prioritize these to avoid bottlenecks and ensure smooth workflow progression.
                                                </li>
                                                <li>
                                                    Completed Tasks: Having 10 completed tasks (43.48%) is a positive sign of productivity. However, there's room for improvement to increase the completion rate.
                                                </li>
                                                <li>
                                                    In-Progress Tasks: 5 tasks (21.74%) are currently in progress, indicating steady work. Ensuring these tasks are completed soon will help reduce the pending load.
                                                </li>
                                            </ul>
                                            <h5 className="flex items-center gap-1 font-mono font-semibold text-sm">
                                                <FaExclamationCircle className="mr-1 text-orange-500" />
                                                Suggestions:
                                            </h5>
                                            <ul className="flex flex-col flex-1 space-y-1 pl-5 text-[12px] list-disc">
                                                <li>
                                                    Focus on resolving pending tasks to reduce backlog.
                                                </li>
                                                <li>
                                                    Streamline the process for in-progress tasks to accelerate their completion.

                                                </li>
                                                <li>
                                                    Maintain the momentum of completed tasks to stay on track with goals.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                        </div>

                        {/* Conditional rendering of the calendar */}
                        {isCalendarVisible && (
                            <div className="top-10 right-0 z-50 absolute bg-gray-50 shadow-md p-2 border rounded-md">
                                <DayPilotNavigator
                                    selectMode={"Week"}
                                    showMonths={1}
                                    skipMonths={1}
                                    selectionDay={new DayPilot.Date(startDate)}
                                    onTimeRangeSelected={(args) => {
                                        setStartDate(new DayPilot.Date(args.day).toString("yyyy-MM-dd"));
                                        setIsCalendarVisible(false); // Hide calendar after selecting a date
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-center p-2 border rounded-md w-full h-[90%]">
                        <TaskPieChart />
                    </div>
                </div>
            </div>
            <div className="flex flex-col space-y-2 w-[40%] h-full">
                <div className="flex bg-white p-2 rounded-md w-full h-[50%]">
                    {/* - Schedule: display the number of hour spent per category, per weeks, per month */}
                    <WeeklyCategoryChart />
                </div>
                <div className="flex bg-white p-2 rounded-md w-full h-[50%]">
                    {/* - Schedule: display the number of hour spent per category, per weeks, per month */}
                    <TimeVsTaskCompletionChart />
                </div>
            </div>
            <div className="flex flex-col space-y-2 w-[30%] h-full">
                <div className="flex bg-white p-2 rounded-md w-full h-[40%]">
                    {/* - showing the top categories */}
                    <WeeklyCategoryPercentageChart />
                </div>
                <div className="flex bg-white rounded-md w-full h-[60%]">
                    {/* - showing the top categories */}
                    <AIFeedback summary={aiSummaryInsights} />
                </div>
            </div>
        </div>
    )
}

export default Analytics