import React from 'react';
import { useDrop } from 'react-dnd';

type DraggableItem = {
    text: string;
    type: string;
};

type CalendarCellProps = {
    hour: string;
    onDrop: (item: DraggableItem, hour: string) => void;
};

const CalendarCell: React.FC<CalendarCellProps> = ({ hour, onDrop }) => {
    const [{ isOver }, drop] = useDrop<DraggableItem, void, { isOver: boolean }>({
        accept: 'ITEM',
        drop: (item) => onDrop(item, hour),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            className={`flex h-10 ${isOver ? 'bg-indigo-100' : 'bg-gray-50 p-2'}`}
        >
        </div>
    );
};

export default CalendarCell;
