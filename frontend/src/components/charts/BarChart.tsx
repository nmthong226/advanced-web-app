import { Bar } from "react-chartjs-2";
import { useSettings } from "../../contexts/SettingsContext"; // Assume this provides the current theme

const PomodoroChart = () => {
    const { settings } = useSettings(); // "light" or "dark"

    const textColor = settings.themeLight === true ? "#333" : "#f5f5f5";

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
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: "bottom" as const,
                labels: {
                    color: textColor, // Dynamic color
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.raw} Pomodoros`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Pomo used per day",
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
            <Bar data={data} options={options} />
        </div>
    );
};

export default PomodoroChart;
