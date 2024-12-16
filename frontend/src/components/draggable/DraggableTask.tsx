import React from 'react';
import { useDrag } from 'react-dnd';

//Import icons
import { GoArrowUp } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { GoArrowDown } from "react-icons/go";

import {
    DropdownMenu,
} from "../ui/dropdown-menu";
// import EditEventItemsDialog from '../dialogs/editEventItems';
import { cn, generateStylesFromParent } from '@/lib/utils';

type DraggableTaskProps = {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    dueTime: string;
    estimatedTime: number;
    backgroundColor: string;
    textColor: string;
    activity: string;
    status: string;
    priority: string;
};

const DraggableTask: React.FC<DraggableTaskProps> =
    ({ title,
        status,
        priority,
        backgroundColor,
        textColor,
        description,
        startTime,
        endTime,
        activity,
        estimatedTime,
        dueTime }) => {

        const [{ isDragging }, drag] = useDrag(() => ({
            type: 'ITEM',
            item: {
                title,
                description,
                startTime,
                endTime,
                status,
                priority,
                estimatedTime,
                dueTime,
                style: {
                    backgroundColor: generateStylesFromParent(backgroundColor),
                    textColor,
                },
            },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        function formatDueTime(isoDate: string): string {
            const date = new Date(isoDate);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' }); // Short month name like Dec
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
            return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}, ${month} ${day}`;
        }

        return (
            <DropdownMenu>
                <div className={cn('relative flex flex-col px-2 py-2 space-y-1 border rounded-md text-sm truncate hover:cursor-grab shadow-md', backgroundColor)} ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
                    {/* Task Header */}
                    <div className='flex text-[11px] truncate'>
                        <p className={cn(`flex items-center font-semibold truncate`, textColor)}>
                            {activity}
                        </p>
                        <p className='mx-1'>|</p>
                        {priority === 'high' && <p className='flex items-center truncate'><GoArrowUp className='mr-1' /> High</p>}
                        {priority === 'medium' && <p className='flex items-center truncate'><GoArrowRight className='mr-1' /> Medium</p>}
                        {priority === 'low' && <p className='flex items-center truncate'><GoArrowDown className='mr-1' /> Low</p>}
                    </div>
                    {/* Task Title */}
                    <p className='font-[500] text-base truncate'>{title}</p>
                    {/* Task Times */}
                    <div className='flex flex-col text-[11px] leading-snug'>
                        <p>
                            Due to: <span className='ml-1'>{formatDueTime(dueTime)}</span>
                        </p>
                        <p>
                            Status: <span className='ml-2 text-pretty capitalize'>{status}</span>
                        </p>
                    </div>
                </div>
            </DropdownMenu>
        );
    };

export default DraggableTask;