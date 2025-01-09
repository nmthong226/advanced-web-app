import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSettings } from '../../contexts/SettingsContext';
// Define the type for the data prop
interface PomodoroData {
  date: string; // Date in string format
  count: number; // Number of pomodoros completed on that date
}

interface PomodoroChartProps {
  data: PomodoroData[]; // Array of pomodoro data
}
const PomodoroChart: React.FC<PomodoroChartProps> = ({ data }) => {
  const { settings } = useSettings(); // "light" or "dark"

  // Debugging to check the received data
  useEffect(() => {
    console.log('PomodoroChart received data:', data);
  }, [data]);

  const textColor = settings.themeLight === true ? '#333' : '#f5f5f5';

  // Generate chart data with proper alignment to Sunday to Saturday
  const labels = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const formattedData = Array(7).fill(0); // Default to 0 for each day of the week

  data.forEach((entry) => {
    const dayIndex = new Date(entry.date).getDay(); // Get the index of the day (0 = Sunday, 6 = Saturday)
    formattedData[dayIndex] = entry.count; // Populate the data array with the count
  });

  const chartData = {
    labels, // Use the static labels for the week
    datasets: [
      {
        label: 'Pomodoros Used',
        data: formattedData, // Use the formatted data array
        backgroundColor: '#3F80EB', // Blue color with transparency
        borderWidth: 1, // Border thickness
        borderRadius: 5, // Rounded corners
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'bottom' as const,
        labels: {
          color: textColor, // Dynamic color
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { raw: any }) {
            return `${context.raw} Pomodoros`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Pomodoro Per Day',
          color: textColor,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: textColor,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: textColor,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-center text-lg font-semibold mb-4 text-gray-800">
        Pomodoro Analytics
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PomodoroChart;
