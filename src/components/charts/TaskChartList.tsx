import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

import { DayPilot } from "@daypilot/daypilot-lite-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
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

const TaskCategoryChart: React.FC = () => {
    const [startDate, ] = useState("2024-12-01"); // Default start date

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
    };

    return (
        <div className="flex flex-col justify-center items-center space-y-3 w-full h-full">
            {/* Horizontal Bar Chart */}
            <Bar data={data} options={options} className="w-full"/>
        </div>
    );
};

export default TaskCategoryChart;
