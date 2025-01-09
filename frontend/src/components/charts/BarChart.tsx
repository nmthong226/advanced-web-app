import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSettings } from '../../contexts/SettingsContext';

const PomodoroChart = ({ data }) => {
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
          label: function (context) {
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
    <div className="w-[98%] h-[160px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PomodoroChart;
