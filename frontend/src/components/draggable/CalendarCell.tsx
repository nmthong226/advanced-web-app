import { addMinutesToTime, cn } from '@/lib/utils';
import React from 'react';
import { useDrop } from 'react-dnd';

// Define DraggableItem type that can represent either an Activity or a Task.

type CalendarCellProps = {
    time: string;
    activity: string | []; // Pass activity for this time slot
    date: string;
    color: string | '';
    className: string;
    style: React.CSSProperties;
    onDrop: (item: Activity, time: string, date: string, color: string) => void;
};


const CalendarCell: React.FC<CalendarCellProps> = ({ date, time, activity, color, onDrop, className }) => {
    const [{ isOver }, drop] = useDrop<Activity, void, { isOver: boolean }>({
        accept: 'ITEM',
        drop: (item) => {
            // Calculate the end time based on the start time (add 15 minutes)
            const updatedEndTime = addMinutesToTime(time, 15);
            const updatedItem = {
                ...item,
                startTime: time,
                endTime: updatedEndTime, // Set the calculated end time
                date: date,
            };
            onDrop(updatedItem, time, date, color); // Pass the updated item to onDrop handler
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            className={cn(`flex h-full ${isOver ? 'bg-indigo-100' : 'bg-gray-50 p-1'} text-[10px] justify-center items-center`, color, className)}
        >
            <p className={`${activity.length > 0 ? 'flex' : 'hidden'}`}>{time}-</p>
            <p>{activity}</p>
        </div>
    );
};

export default CalendarCell;
