//Import frameworks
import { useState } from "react";

//Import components
import {
    Tooltip as TooltipShadcn,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/tooltip";

//Import libs/packages
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";

//Import icons
import { AiFillInfoCircle } from "react-icons/ai";
import { CalendarDaysIcon } from "lucide-react";
import { LuCalendarClock } from "react-icons/lu";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const mockWeeklyData = [
    {
        week: "2024-12-01 to 2024-12-07",
        timeSpent: [5, 3, 6, 4, 7, 2, 8],
        estimatedTime: [6, 4, 5, 5, 6, 3, 7],
    },
    {
        week: "2024-12-08 to 2024-12-14",
        timeSpent: [4, 5, 7, 3, 6, 2, 8],
        estimatedTime: [5, 5, 6, 4, 7, 3, 8],
    },
    {
        week: "2024-12-15 to 2024-12-21",
        timeSpent: [6, 4, 7, 5, 8, 3, 9],
        estimatedTime: [7, 5, 8, 6, 8, 4, 9],
    },
];

const DoubleBarChart = () => {
    const [startDate, setStartDate] = useState("2024-12-01");
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    // Find the data for the currently selected week
    const currentWeekData = mockWeeklyData.find((week) => {
        const weekStart = new DayPilot.Date(startDate).toString("yyyy-MM-dd");
        const weekEnd = new DayPilot.Date(startDate).addDays(6).toString("yyyy-MM-dd");
        return week.week === `${weekStart} to ${weekEnd}`;
    }) || {
        timeSpent: Array(7).fill(0),
        estimatedTime: Array(7).fill(0),
    };

    const data = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // Days of the week
        datasets: [
            {
                label: "Time Spent (hrs)",
                data: currentWeekData.timeSpent, // Dynamic time spent data
                backgroundColor: "#7370FB", // Color for time spent bars
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: "Estimated Time (hrs)",
                data: currentWeekData.estimatedTime, // Dynamic estimated time data
                backgroundColor: "#A1B4FF", // Color for estimated time bars
                borderWidth: 1,
                borderRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    font: {
                        size: 10,
                        family: "Arial, sans-serif",
                    },
                    padding: 20,
                    boxWidth: 10,
                    boxHeight: 10,
                    usePointStyle: true,
                },
            },
        },
        scales: {
            x: {
                stacked: false,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="flex flex-col justify-center items-center space-y-2 w-full h-full">
            <div className="flex justify-between items-center w-full h-[10%]">
                <div className="flex items-center font-semibold text-sm">
                    <LuCalendarClock className="mr-2" />
                    <p className="mr-0.5">Time Spent vs Estimated Time</p>
                    <TooltipProvider>
                        <TooltipShadcn>
                            <TooltipTrigger asChild>
                                <div className="flex items-center hover:cursor-pointer">
                                    <AiFillInfoCircle className="text-gray-500/40 size-4" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white shadow-xl border text-muted-foreground text-zinc-700">
                                <p>Track your task's status</p>
                            </TooltipContent>
                        </TooltipShadcn>
                    </TooltipProvider>
                </div>
                <div className="relative flex space-x-1 text-center">
                    <button
                        className="flex items-center border-2 hover:bg-gray-100 px-2 py-1 rounded-md"
                        onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                    >
                        <CalendarDaysIcon className="mr-2 w-4 h-4" /> {/* Icon */}
                        <p className="text-[12px]">
                            {new DayPilot.Date(startDate).toString("dd")} -{" "}
                            {new DayPilot.Date(startDate).addDays(6).toString("dd MMM yy")}
                        </p>
                    </button>
                    {isCalendarVisible && (
                        <div className="top-10 left-1/2 z-50 absolute bg-white shadow-md p-2 border rounded-md transform -translate-x-1/2">
                            <DayPilotNavigator
                                selectMode="Week"
                                showMonths={1}
                                skipMonths={1}
                                selectionDay={new DayPilot.Date(startDate)}
                                onTimeRangeSelected={(args) => {
                                    setStartDate(new DayPilot.Date(args.day).toString("yyyy-MM-dd"));
                                    setIsCalendarVisible(false);
                                }}
                            />
                        </div>
                    )}
                    <button className="relative flex justify-center items-center bg-gradient-to-r from-indigo-500 to-cyan-400 p-[1px] rounded-full w-7 h-7">
                        <div className="flex justify-center items-center bg-white rounded-full w-full h-full">
                            <p className="bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400 font-bold text-center text-transparent">✨</p>
                        </div>
                    </button>
                </div>
            </div>
            {/* Bar Chart */}
            <div className="flex justify-center items-center border rounded-xl w-full h-[90%]">
                <div className="flex justify-center items-center w-[80%] h-full">
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default DoubleBarChart;
