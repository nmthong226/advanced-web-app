import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PomodoroChart = () => {
    const data = {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Days of the week
        datasets: [
            {
                label: "Pomodoros Used",
                data: [8, 5, 7, 6, 4, 9, 10], // Number of Pomodoros per day
                backgroundColor: "#3F80EB", // Red-rose color with transparency
                borderWidth: 1, // Border thickness
                borderRadius: 5, // Rounded corners
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow for better scaling for custom height/width
        plugins: {
            legend: {
                display: false,
                position: "bottom" as const,
                labels: {
                    fontSize: 12,
                    usePointStyle: true,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.raw} Pomodoros`; // Customize tooltip label
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Pomo used per day",
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    display: false, // Hide vertical grid lines
                },
            },
        },
    };

    return (
        <div className="w-full h-[200px]">
            <Bar data={data} options={options} />
        </div>
    );
};

export default PomodoroChart;
