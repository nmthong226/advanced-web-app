import { cn } from '@/lib/utils';
import React from 'react';
import { useDrag } from 'react-dnd';

type DraggableItemProps = {
    id: string;
    title: string;
    description: string;
    type: 'activity'; // Differentiates from task
    startTime: string; // e.g., '09:30 AM'
    endTime: string; // e.g., '10:30 AM'
    date: string;
    backgroundColor: string;
    textColor: string;
    duration: number;
};

const DraggableItem: React.FC<DraggableItemProps> = ({ title, type, backgroundColor, textColor, description, startTime, endTime, date, duration }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: {
            title,
            type,
            description,
            startTime,
            endTime,
            date,
            style: {
                backgroundColor, 
                textColor,
            },
            duration
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={cn(`rounded-md border px-4 py-3 font-mono text-sm truncate ${isDragging ? 'opacity-50' : 'opacity-100'}`, backgroundColor)}
            style={{
                cursor: 'grab',
            }}
        >
            {title}
        </div>
    );
};

export default DraggableItem;
