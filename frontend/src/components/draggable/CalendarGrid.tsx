import React, { useState } from 'react';
import CalendarCell from "./CalendarCell";

// Define the type for the draggable item.
type DraggableItem = {
    text: string;
    type: string;
};

const CalendarGrid = () => {
    // Use state to track items dropped in specific hours
    const [schedule, setSchedule] = useState<{ [hour: string]: DraggableItem[] }>({});

    // Handler to manage dropped items
    const handleDrop = (item: DraggableItem, hour: string) => {
        console.log(`Dropped ${item.text} at hour: ${hour}`);
        setSchedule((prev) => ({
            ...prev,
            [hour]: [...(prev[hour] || []), item],
        }));
    };

    // Helper to format hours to a 12-hour format
    const formatHour = (hour: number): string => {
        const isAM = hour < 12;
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour} ${isAM ? 'AM' : 'PM'}`;
    };

    return (
        <div className="w-[95%] h-full grid grid-cols-7 grid-rows-24 gap-0.5">
            {/* Days of the week */}
            <div className="flex flex-col justify-between h-20 items-center bg-indigo-50 font-bold text-center text-zinc-500">
                <div className="flex h-14 flex-col px-2 leading-tight justify-center items-center text-center">
                    <p className="text-[12px]">Sun</p>
                    <p>24</p>
                </div>
                <div className="flex h-6 bg-indigo-200 w-full"></div>
            </div>
            <div className="flex flex-col justify-between h-20 items-center bg-indigo-50 font-bold text-center text-zinc-500">
                <div className="flex h-14 flex-col px-2 leading-tight justify-center items-center text-center">
                    <p className="text-[12px]">Mon</p>
                    <p>25</p>
                </div>
                <div className="flex h-6 bg-indigo-600 w-full text-white justify-center text-sm">2 tasks due</div>
            </div>
            <div className="flex flex-col justify-between h-20 items-center bg-indigo-50 font-bold text-center text-zinc-500">
                <div className="flex h-14 flex-col px-2 leading-tight justify-center items-center text-center">
                    <p className="text-[12px]">Tue</p>
                    <p>26</p>
                </div>
                <div className="flex h-6 bg-indigo-600 w-full text-white justify-center text-sm">1 task due</div>
            </div>
            <div className="flex flex-col justify-between h-20 items-center bg-indigo-50 font-bold text-center text-zinc-500">
                <div className="flex h-14 flex-col px-2 leading-tight justify-center items-center text-center">
                    <p className="text-[12px]">Wed</p>
                    <p>27</p>
                </div>
                <div className="flex h-6 bg-indigo-200 w-full"></div>
            </div>
            <div className="flex flex-col justify-between h-20 items-center bg-indigo-50 font-bold text-center text-zinc-500">
                <div className="flex h-14 flex-col px-2 leading-tight justify-center items-center text-center">
                    <p className="text-[12px]">Thu</p>
                    <p>28</p>
                </div>
                <div className="flex h-6 bg-indigo-200 w-full"></div>
            </div>
            <div className="flex flex-col justify-between h-20 items-center bg-indigo-50 font-bold text-center text-zinc-500">
                <div className="flex h-14 flex-col px-2 leading-tight justify-center items-center text-center">
                    <p className="text-[12px]">Fri</p>
                    <p>29</p>
                </div>
                <div className="flex h-6 bg-indigo-200 w-full"></div>
            </div>
            <div className="flex flex-col justify-between h-20 items-center bg-indigo-50 font-bold text-center text-zinc-500">
                <div className="flex h-14 flex-col px-2 leading-tight justify-center items-center text-center">
                    <p className="text-[12px]">Sar</p>
                    <p>30</p>
                </div>
                <div className="flex h-6 bg-indigo-200 w-full"></div>
            </div>
            {Array.from({ length: 48 }, (_, hour) => {
                const formattedHour = formatHour(hour);
                return (
                    <>
                        {Array.from({ length: 7 }, (_, day) => (
                            <CalendarCell
                                key={`${day}-${hour}`}
                                hour={formattedHour}
                                onDrop={(item) => handleDrop(item, formattedHour)}
                            />
                        ))}
                    </>
                );
            })}

        </div>
    );
};

export default CalendarGrid;
