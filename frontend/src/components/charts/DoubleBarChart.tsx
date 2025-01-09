import React from 'react';
import {
  Tooltip as TooltipShadcn,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
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
import { AiFillInfoCircle } from 'react-icons/ai';
import { LuCalendarClock } from 'react-icons/lu';

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

const DoubleBarChart: React.FC<DoubleBarChartProps> = ({ data }) => {
  // Debug: Received data
  console.log('DoubleBarChart received data:', data);

  // Extract dates and sort them
  const sortedDates = Object.keys(data).sort();
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
          display: true,
          text: 'Task Count',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-2 w-full h-full">
      <div className="flex justify-between items-center w-full h-[10%]">
        <div className="flex items-center font-semibold text-sm">
          <LuCalendarClock className="mr-2" />
          <p className="mr-0.5">Weekly Task Counts</p>
          <TooltipProvider>
            <TooltipShadcn>
              <TooltipTrigger asChild>
                <div className="flex items-center hover:cursor-pointer">
                  <AiFillInfoCircle className="text-gray-500/40 size-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white shadow-xl border text-muted-foreground text-zinc-700">
                <p>Track your weekly task counts by status</p>
              </TooltipContent>
            </TooltipShadcn>
          </TooltipProvider>
        </div>
      </div>
      {/* Bar Chart */}
      <div className="flex justify-center items-center border rounded-xl w-full h-[90%]">
        <div className="flex justify-center items-center w-[80%] h-full">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DoubleBarChart;
