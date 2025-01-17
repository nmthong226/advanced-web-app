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

interface WeeklyTaskCounts {
  [date: string]: {
    completed: number;
    'in-progress': number;
    pending: number;
    expired: number;
  };
}

interface DoubleBarChartProps {
  data: WeeklyTaskCounts;
}

// Utility function to sort dates by Sunday-to-Saturday order
const sortDatesByWeek = (dates: string[]) => {
  return dates.sort((a, b) => {
    const dayOrder = [0, 1, 2, 3, 4, 5, 6]; // Sunday = 0, Monday = 1, ..., Saturday = 6
    const dayA = new Date(a).getDay();
    const dayB = new Date(b).getDay();
    return dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB);
  });
};

const DoubleBarChart: React.FC<DoubleBarChartProps> = ({ data }) => {
  // Debug: Received data
  console.log('DoubleBarChart received data:', data);

  // Extract dates and sort them by Sunday-to-Saturday order
  const sortedDates = sortDatesByWeek(Object.keys(data));
  const labels = sortedDates.map((date) => {
    const dayName = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
    });
    return dayName; // Example: "Sun", "Mon", etc.
  });

  // Extract task counts for completed, in-progress, pending, and expired
  const completedCounts = sortedDates.map((date) => data[date].completed);
  const inProgressCounts = sortedDates.map((date) => data[date]['in-progress']);
  const pendingCounts = sortedDates.map((date) => data[date].pending);
  const expiredCounts = sortedDates.map((date) => data[date].expired);

  // Debug: Processed chart data
  console.log('Chart Labels:', labels);
  console.log('Completed Counts:', completedCounts);
  console.log('In-Progress Counts:', inProgressCounts);
  console.log('Pending Counts:', pendingCounts);
  console.log('Expired Counts:', expiredCounts);

  const chartData = {
    labels: labels, // Days of the week
    datasets: [
      {
        label: 'Completed',
        data: completedCounts,
        backgroundColor: '#4CAF50', // Green for completed tasks
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'In-Progress',
        data: inProgressCounts,
        backgroundColor: '#FFC107', // Yellow for in-progress tasks
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Pending',
        data: pendingCounts,
        backgroundColor: '#FF9800', // Orange for pending tasks
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Expired',
        data: expiredCounts,
        backgroundColor: '#F44336', // Red for expired tasks
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 10,
            family: 'Arial, sans-serif',
          },
          padding: 20,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Days of the Week',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        stacked: true,
        title: {
          display: false,
          text: 'Task Count',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center bg-white shadow-md p-4 rounded-lg w-full h-[350px]">
      <div className="flex items-center w-full h-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DoubleBarChart;
