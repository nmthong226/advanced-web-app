import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig


const Chart = () => {
    const chartData = [
        { month: "Sun", desktop: 214, mobile: 140 },
        { month: "Mon", desktop: 186, mobile: 80 },
        { month: "Tue", desktop: 305, mobile: 200 },
        { month: "Wed", desktop: 237, mobile: 120 },
        { month: "Thu", desktop: 73, mobile: 190 },
        { month: "Fri", desktop: 209, mobile: 130 },
        { month: "Sat", desktop: 214, mobile: 140 },
    ]
    return (
        <ChartContainer config={chartConfig} className="w-full h-[160px]">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}

export default Chart