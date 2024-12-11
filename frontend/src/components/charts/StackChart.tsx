//Import frameworks
import React, { useState } from "react";

//Import components
import {
    Tooltip as TooltipShadcn,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/tooltip"

//Import icons
import { CalendarDaysIcon } from "lucide-react";
import { BsActivity } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";

//Import libs/packages
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem,
} from "chart.js";
import { DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock Weekly Data
const mockWeeklyData = [
    {
        week: "2024-12-01 to 2024-12-07",
        statistics: {
            tasksCompleted: 5,
            hoursSpent: 40,
            categories: {
                Study: 20,
                Work: 10,
                Exercise: 5,
                Leisure: 5,
            },
        },
    },
    {
        week: "2024-12-08 to 2024-12-14",
        statistics: {
            tasksCompleted: 6,
            hoursSpent: 42,
            categories: {
                Study: 18,
                Work: 12,
                Exercise: 6,
                Leisure: 6,
            },
        },
    },
    {
        week: "2024-12-15 to 2024-12-21",
        statistics: {
            tasksCompleted: 7,
            hoursSpent: 38,
            categories: {
                Study: 22,
                Work: 8,
                Exercise: 4,
                Leisure: 4,
            },
        },
    },
    {
        week: "2024-12-22 to 2024-12-28",
        statistics: {
            tasksCompleted: 4,
            hoursSpent: 36,
            categories: {
                Study: 16,
                Work: 12,
                Exercise: 4,
                Leisure: 4,
            },
        },
    },
];

const WeeklyStatisticsChart: React.FC = () => {
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [startDate, setStartDate] = useState("2024-12-01"); // Default start date

    // Find the data for the currently selected week
    const currentWeekData = mockWeeklyData.find((week) => {
        const weekStart = new DayPilot.Date(startDate).toString("yyyy-MM-dd");
        const weekEnd = new DayPilot.Date(startDate).addDays(6).toString("yyyy-MM-dd");
        return week.week === `${weekStart} to ${weekEnd}`;
    });

    const categories = ["Study", "Work", "Exercise", "Leisure"];
    const chartColors = ["#405281", "#A8B7C0", "#CADFEA", "#D3A9A9"];

    // Prepare data for the chart
    const data = {
        labels: categories,
        datasets: [
            {
                label: `Hours Spent (${new DayPilot.Date(startDate).toString("dd MMM yy")} - ${new DayPilot.Date(
                    startDate
                )
                    .addDays(6)
                    .toString("dd MMM yy")})`,
                data: categories.map(
                    (category) =>
                        currentWeekData?.statistics.categories[category as keyof typeof currentWeekData.statistics.categories] || 0
                ),
                backgroundColor: chartColors,
                borderWidth: 1,
                borderRadius: 5,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<"bar">) => {
                        const hours = context.raw as number;
                        return `${context.label}: ${hours} hours`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Categories",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Hours Spent",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="flex flex-col justify-center items-center space-y-2 w-full h-full">
            {/* Week Selector with Calendar */}
            <div className="flex justify-between items-center w-full h-[10%]">
                <div className="flex items-center font-semibold text-sm">
                    <BsActivity className="mr-2" />
                    <p className="mr-0.5">Weekly Activity Time</p>
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
                                    setIsCalendarVisible(false); // Hide calendar after selection
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
                <div className="flex justify-center items-center w-[90%] h-full">
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default WeeklyStatisticsChart;
