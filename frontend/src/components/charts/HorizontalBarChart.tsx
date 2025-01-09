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
import { BsActivity } from 'react-icons/bs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface WeeklyCategoryChartProps {
  data: { [category: string]: number }; // Accepts categories data
}

const WeeklyCategoryPercentageChart: React.FC<WeeklyCategoryChartProps> = ({
  data,
}) => {
  // Debug: Check received data
  console.log('WeeklyCategoryPercentageChart received data:', data);

  // Extract categories and counts
  const categories = Object.keys(data);
  const counts = Object.values(data);

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
    <div className="flex flex-col justify-center items-center space-y-3 w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center mt-1 w-full h-[10%]">
        <div className="flex items-center font-semibold text-sm">
          <BsActivity className="mr-2" />
          <p>Category Distribution</p>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="flex justify-center items-center border rounded-xl w-full h-[90%]">
        <div className="flex justify-center items-center w-[90%] h-full">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default WeeklyCategoryPercentageChart;
