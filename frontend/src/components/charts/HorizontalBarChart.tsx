import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

import { DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { BsActivity } from "react-icons/bs";
import { CalendarDaysIcon } from "lucide-react";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock Weekly Data
const mockWeeklyData = [
    {
        week: "2024-12-01 to 2024-12-07",
        statistics: {
            tasksCompleted: 5,
            hoursSpent: 40,
            categories: {
                Economics: 18,
                Math: 10,
                Science: 8,
                Art: 4,
            },
        },
    },
    {
        week: "2024-12-08 to 2024-12-14",
        statistics: {
            tasksCompleted: 6,
            hoursSpent: 42,
            categories: {
                Economics: 16,
                Math: 12,
                Science: 9,
                Art: 5,
            },
        },
    },
];

// Define the type for the category object
type Categories = {
    Economics: number;
    Math: number;
    Science: number;
    Art: number;
};

const WeeklyCategoryPercentageChart: React.FC = () => {
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [startDate, setStartDate] = useState("2024-12-01"); // Default start date

    // Find the data for the currently selected week
    const currentWeekData = mockWeeklyData.find((week) => {
        const weekStart = new DayPilot.Date(startDate).toString("yyyy-MM-dd");
        const weekEnd = new DayPilot.Date(startDate).addDays(6).toString("yyyy-MM-dd");
        return week.week === `${weekStart} to ${weekEnd}`;
    });

    // Extract categories and ensure safe indexing
    const categories = Object.keys(
        currentWeekData?.statistics.categories || {}
    ) as Array<keyof Categories>;

    const totalHours = currentWeekData?.statistics.hoursSpent || 1;

    const percentages = categories.map(
        (category) =>
            ((currentWeekData?.statistics.categories[category] || 0) / totalHours) *
            100
    );

    const maxPercentage = Math.max(...percentages); // Find the largest percentage

    // Chart data and options
    const data = {
        labels: categories,
        datasets: [
            {
                data: percentages,
                backgroundColor: [
                    "#01528A",
                    "#0096D3",
                    "#21E499",
                    "#C7BFAA",
                ],
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderWidth: 1,
                borderRadius: 3,
            },
        ],
    };

    const options = {
        indexAxis: "y" as const, // Horizontal bar chart
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) =>
                        `${context.label}: ${context.raw.toFixed(2)}%`,
                },
            },
        },
        scales: {
            x: {
                min: 0,
                max: maxPercentage + 5, // Set max to the largest percentage + a buffer
                beginAtZero: true,
                ticks: {
                    callback: function (value: any, index: any, ticks: any) {
                        // Only append '%' on the last tick
                        if (index === ticks.length - 1) {
                            return value.toFixed(0) + '%'; // Add '%' to the last value only
                        }
                        return value.toFixed(0); // Normal ticks without '%'
                    },
                },
            },
        },
    };

    return (
        <div className="flex flex-col justify-center items-center space-y-3 w-full h-full">
            {/* Week Selector */}
            <div className="flex justify-between items-center mt-1 w-full h-[10%]">
                <div className="flex items-center font-semibold text-sm">
                    <BsActivity className="mr-2" />
                    <p>Activity Statistics</p>
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
                        <div className="top-10 left-0 z-50 absolute bg-white shadow-md p-2 border rounded-md transform -translate-x-1/2">
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

            {/* Horizontal Bar Chart */}
            <div className="flex justify-center items-center border rounded-xl w-full h-[90%]">
                <div className="flex justify-center items-center w-[90%] h-full">
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default WeeklyCategoryPercentageChart;
