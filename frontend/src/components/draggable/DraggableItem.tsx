import React from 'react';
import { useDrag } from 'react-dnd';

type DraggableItemProps = {
    text: string;
    type: string;
};

const DraggableItem: React.FC<DraggableItemProps> = ({ text, type }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: { text, type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`rounded-md border px-4 py-3 font-mono text-sm truncate bg-purple-100 border-l-[5px] border-l-purple-600 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            style={{
                cursor: 'grab',
            }}
        >
            {text}
        </div>
    );
};

export default DraggableItem;
