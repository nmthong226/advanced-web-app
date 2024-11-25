import { addMinutesToTime, cn, formatTimeRange } from '@/lib/utils';
import React from 'react';
import { useDrop } from 'react-dnd';

// Define DraggableItem type that can represent either an Activity or a Task.

type CalendarCellProps = {
    time: string;
    activity?: Activity; // Pass activity for this time slot
    date: string;
    className: string;
    style: React.CSSProperties;
    onDrop: (item: Activity, time: string, date: string) => void;
};


const CalendarCell: React.FC<CalendarCellProps> = ({ date, time, activity, onDrop, className }) => {
    const [{ isOver }, drop] = useDrop<Activity, void, { isOver: boolean }>({
        accept: 'ITEM',
        drop: (item) => {
            // Calculate the end time based on the start time (add 15 minutes)
            const updatedEndTime = addMinutesToTime(time, 60);
            const updatedItem = {
                ...item,
                startTime: time,
                endTime: updatedEndTime, // Set the calculated end time
                date: date,
            };
            onDrop(updatedItem, time, date); // Pass the updated item to onDrop handler
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            className={cn(`flex flex-col h-full ${isOver ? 'bg-indigo-100' : 'bg-gray-50 p-1'}`, activity?.style.backgroundColor, className)}
        >
            {activity &&
                <>
                    <p className={cn(`text-[10px] font-semibold`, activity.style.textColor)}>
                        {activity ? formatTimeRange(activity.startTime, activity.endTime) : ''}
                    </p>
                    <p className='text-sm font-bold text-zinc-600'>{activity.title}</p>
                </>}

        </div>
    );
};

export default CalendarCell;
