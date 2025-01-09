import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSettings } from '../../contexts/SettingsContext';

interface PomodoroData {
  date: string; // Date in string format
  count: number; // Number of pomodoros completed on that date
}

interface PomodoroChartProps {
  data: PomodoroData[]; // Array of pomodoro data
}

const PomodoroChart: React.FC<PomodoroChartProps> = ({ data }) => {
  const { settings } = useSettings(); // "light" or "dark"

  useEffect(() => {
    console.log('PomodoroChart received data:', data);
  }, [data]);

  const textColor = settings.themeLight === true ? '#333' : '#f5f5f5';

  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const formattedData = Array(7).fill(0);

  data.forEach((entry) => {
    const dayIndex = new Date(entry.date).getDay();
    formattedData[dayIndex] = entry.count;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pomodoros Used',
        data: formattedData,
        backgroundColor: '#3F80EB',
        borderWidth: 1,
        borderRadius: 5,
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
          color: textColor,
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
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: textColor,
          callback: function (tickValue: string | number) {
            if (typeof tickValue === 'number' && Number.isInteger(tickValue)) {
              return tickValue;
            }
            return '';
          },
        },
        grid: {
          display: true,
          color: textColor + '33',
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PomodoroChart;
