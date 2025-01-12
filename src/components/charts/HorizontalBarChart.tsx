import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface WeeklyCategoryChartProps {
  data: { [category: string]: number } | null; // Accepts categories data
}

const WeeklyCategoryPercentageChart: React.FC<WeeklyCategoryChartProps> = ({
  data,
}) => {
  // Debug: Check received data
  console.log('WeeklyCategoryPercentageChart received data:', data);

  // Extract categories and counts
  const categories = Object.keys(data?.categories || {});
  const counts = Object.values(data?.categories || {});

  // Calculate total tasks and percentages
  const totalTasks = counts.reduce((sum, count) => sum + count, 0) || 1; // Avoid division by zero
  const percentages = counts.map((count) => (count / totalTasks) * 100);

  // Chart data and options
  const chartData = {
    labels: categories,
    datasets: [
      {
        data: percentages,
        backgroundColor: ['#01528A', '#0096D3', '#21E499', '#C7BFAA'],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
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
        max: 100, // Percentages range from 0 to 100
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value}%`, // Add '%' to tick labels
        },
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-3 shadow-md w-full h-full">
      {/* Horizontal Bar Chart */}
      <div className="flex justify-center items-center rounded-xl w-full h-full">
        <div className="flex justify-center items-center w-full h-full">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default WeeklyCategoryPercentageChart;
