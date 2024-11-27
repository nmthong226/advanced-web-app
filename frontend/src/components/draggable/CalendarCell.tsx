import { addMinutesToTime, cn, formatTimeRange } from '@/lib/utils';
import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';

type CalendarCellProps = {
    time: string;
    activity?: Activity;
    date: string;
    className: string;
    style: React.CSSProperties;
    onDrop: (item: Activity, time: string, date: string) => void;
    onResize: (id: string, date: string, newDuration: number) => void; // Add a resize handler
};

const CalendarCell: React.FC<CalendarCellProps> = ({
    date,
    time,
    activity,
    onDrop,
    className,
    onResize,
}) => {
    const [isResizing, setIsResizing] = useState(false);
    const resizingEdgeRef = useRef<'top' | 'bottom' | null>(null);
    const [resizeStartY, setResizeStartY] = useState(0);

    const [{ isOver }, drop] = useDrop<Activity, void, { isOver: boolean }>({
        accept: 'ITEM',
        drop: (item) => {
            const updatedEndTime = addMinutesToTime(time, 60);
            const updatedItem = {
                ...item,
                startTime: time,
                endTime: updatedEndTime,
                date: date,
            };
            onDrop(updatedItem, time, date);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing && activity && resizingEdgeRef.current) {
            const deltaY = e.clientY - resizeStartY;
            const heightChange = deltaY; // Change in height in pixels
    
            // Calculate duration change based on height change
            const durationChange = Math.floor(heightChange / 20) * 15; // 20px per 15 minutes
            let newDuration = activity.duration;
    
            if (resizingEdgeRef.current === 'top') {
                newDuration = Math.max(15, activity.duration - durationChange); // Reduce duration from the top
            } else if (resizingEdgeRef.current === 'bottom') {
                newDuration = Math.max(15, activity.duration + durationChange); // Increase duration at the bottom
            }
    
            // Ensure duration reflects increments/decrements of 15 minutes
            if (newDuration !== activity.duration) {
                onResize(activity.id, date, newDuration);
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent, edge: 'top' | 'bottom') => {
        e.stopPropagation(); // Prevent event from bubbling to other elements
        resizingEdgeRef.current = edge;
        setIsResizing(true);
        setResizeStartY(e.clientY);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
        resizingEdgeRef.current = null;
        setIsResizing(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={drop}
            className={cn(
                `relative flex flex-col h-full ${isOver ? 'bg-indigo-100' : 'bg-gray-50 p-1'}`,
                activity?.style.backgroundColor,
                className
            )}
        >
            {activity && (
                <>
                    <p className={cn(`text-[10px] font-semibold`, activity.style.textColor)}>
                        {activity ? formatTimeRange(activity.startTime, activity.endTime) : ''}
                    </p>
                    <p className="text-sm font-bold text-zinc-600">{activity.title}</p>
                    {/* Top resize handle */}
                    <div
                        onMouseDown={(e) => handleMouseDown(e, 'top')}
                        className="absolute top-0 left-0 w-full h-2 cursor-ns-resize"
                    />
                    {/* Bottom resize handle */}
                    <div
                        onMouseDown={(e) => handleMouseDown(e, 'bottom')}
                        className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
                    />
                </>
            )}
        </div>
    );
};

export default CalendarCell;
