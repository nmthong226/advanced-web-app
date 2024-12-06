import React from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const scheduleData = {
    categories: ["Study", "Exercise", "Work", "Leisure"],
    weeklyHours: [
        { week: "Week 1", Study: 15, Exercise: 5, Work: 20, Leisure: 10 },
        { week: "Week 2", Study: 12, Exercise: 4, Work: 18, Leisure: 8 },
        { week: "Week 3", Study: 20, Exercise: 6, Work: 22, Leisure: 12 },
        { week: "Week 4", Study: 10, Exercise: 3, Work: 15, Leisure: 5 },
    ],
};


const WeeklyCategoryChart: React.FC = () => {
    const { categories, weeklyHours } = scheduleData;

    // Prepare data for Chart.js
    const data = {
        labels: weeklyHours.map((week) => week.week), // Weeks on x-axis
        datasets: categories.map((category, index) => ({
            label: category,
            data: weeklyHours.map((week) => week[category]),
            backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"][index], // Unique color per category
        })),
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top", // Legend at the top
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const hours = context.raw;
                        return `${context.dataset.label}: ${hours} hours`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Weeks", // X-axis label
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Hours Spent", // Y-axis label
                },
                beginAtZero: true, // Start y-axis at 0
            },
        },
    };

    return (
        <div style={{ width: "80%", margin: "0 auto" }}>
            <h3 className="mb-4 font-semibold text-center text-lg">
                Weekly Time Spent per Category
            </h3>
            <Bar data={data} options={options} />
        </div>
    );
};

export default WeeklyCategoryChart;
