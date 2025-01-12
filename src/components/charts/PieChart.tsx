// src/components/charts/PieChart.tsx

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { TaskChartData } from '../../types/taskChart'; // Adjust the path based on your project structure

// Register required Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

interface TaskPieChartProps {
  data: TaskChartData;
}

const TaskPieChart: React.FC<TaskPieChartProps> = ({ data }) => {
  // Destructure data for clarity
  const { completed, 'in-progress': inProgress, pending, expired } = data;

  // Compute total tasks for percentage calculations
  const total = completed + inProgress + pending + expired;

  // Prepare data for the chart
  const chartData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Expired'],
    datasets: [
      {
        label: 'Task Status',
        data: [completed, inProgress, pending, expired],
        backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384', '#FF6434'], // Customize colors as needed
        borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'], // White borders for better separation
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
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12, // Adjust font size
            family: 'Arial, sans-serif', // Customize font family
          },
          padding: 12, // Add padding between labels
          boxWidth: 12, // Adjust box width
          boxHeight: 12, // Adjust box height
          usePointStyle: true, // Use point style for labels
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-[340px] h-[340px]">
      <Pie data={chartData} options={options}/>
    </div>
  );
};

export default TaskPieChart;
