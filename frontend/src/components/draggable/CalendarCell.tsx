import { addMinutesToTime, cn, formatTimeRange } from '@/lib/utils';
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';

type CalendarCellProps = {
    time: string;
    activity?: Activity;
    date: string;
    className: string;
    style: React.CSSProperties;
    onDrop: (item: Activity, time: string, date: string) => void;
    onResize: (id: string, date: string, newDuration: number) => void;
};

const CalendarCell: React.FC<CalendarCellProps> = ({
    date,
    time,
    activity,
    onDrop,
    className,
    onResize,
}) => {
    const [{ isOver }, drop] = useDrop<Activity, void, { isOver: boolean }>({
        accept: 'ITEM',
        drop: (item) => {
            // Ensure the dropped item matches the current activity
            if (item.id === activity?.id) {
                const updatedEndTime = addMinutesToTime(time, 60);
                const updatedItem = {
                    ...item,
                    startTime: time,
                    endTime: updatedEndTime,
                    date: date,
                };
                onDrop(updatedItem, time, date);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            className={cn(
                `relative flex flex-col h-full bg-gray-50 p-1 ${isOver ? 'bg-indigo-100' : 'bg-gray-50 p-1'}`,
                activity?.style.backgroundColor,
                className
            )}
        >
            {activity && (
                <Rnd
                    size={{
                        width: '100%', // Adjust width as necessary
                        height: '100%', // Set initial height based on activity duration
                    }}
                    position={{ x: 1, y: 3 }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        // Only proceed if the resized activity matches the active one
                        const newHeight = ref.offsetHeight;
                        const newDuration = Math.max(15, Math.floor(newHeight / 20) * 15); // Calculate new duration based on height
                        onResize(activity.id, date, newDuration);
                    }}
                    minWidth={100} // Minimum width for resizing (can be customized)
                    minHeight={20} // Minimum height for resizing (can be customized)
                    enableResizing={{
                        top: false,
                        right: false,
                        bottom: true,
                        left: false,
                    }}
                    disableDragging={true} // Disable dragging to prevent moving the activity around
                    className={`${activity?.style.backgroundColor} ${className} z-10`}
                >
                    <p className={cn(`text-[10px] font-semibold`, activity.style.textColor)}>
                        {activity ? formatTimeRange(activity.startTime, activity.endTime) : ''}
                    </p>
                    <p className="text-sm font-bold text-zinc-600">{activity.title}</p>
                </Rnd>
            )}
        </div>
    );
};

export default CalendarCell;
