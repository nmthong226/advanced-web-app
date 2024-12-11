import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskPieChart: React.FC = () => {
    // Sample data for the tasks
    const taskData = {
        completed: 10,
        inProgress: 5,
        pending: 8,
    };

    // Prepare data for the chart
    const data = {
        labels: ["Completed", "In Progress", "Pending"],
        datasets: [
            {
                label: "Task Status",
                data: [taskData.completed, taskData.inProgress, taskData.pending],
                backgroundColor: ["#EFF3FF", "#C6DBEF", "#6BAED6"], // Colors for each section
                borderWidth: 2,
            },
        ],

    };

    const options = {
        responsive: true,
        maintainAspectRatio: true, // Ensures the aspect ratio is maintained
        aspectRatio: 1, // A ratio of 1 makes the chart a square
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    font: {
                        size: 10, // Adjust font size
                        family: "Arial, sans-serif", // Customize font family
                    },
                    padding: 20, // Add padding between labels
                    boxWidth: 10, // Adjust box width
                    boxHeight: 10, // Adjust box height
                    usePointStyle: true, // Use point style for labels
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw;
                        const total = taskData.completed + taskData.inProgress + taskData.pending;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
            
        },
    };


    return (
        <div className="flex mx-auto w-72 h-72">
            <Pie data={data} options={options} />
        </div>
    );
};

export default TaskPieChart;
