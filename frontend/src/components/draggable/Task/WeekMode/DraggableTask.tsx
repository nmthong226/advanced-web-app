import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';

//Import icons
import { GoArrowUp } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { GoArrowDown } from "react-icons/go";

import {
    DropdownMenu,
} from "../../../ui/dropdown-menu";
// import EditEventItemsDialog from '../dialogs/editEventItems';
import { cn } from '@/lib/utils';
import { Badge } from '../../../ui/badge';

type DraggableTaskProps = {
    _id: string;
    title: string;
    description: string | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
    dueTime: string | undefined;
    estimatedTime: number | undefined;
    backgroundColor: string | undefined;
    textColor: string;
    activity: string;
    status: string;
    priority: string;
    isOnCalendar: boolean;
};

const DraggableTask: React.FC<DraggableTaskProps> =
    ({
        _id,
        title,
        status,
        priority,
        backgroundColor,
        textColor,
        description,
        startTime,
        endTime,
        activity,
        estimatedTime,
        dueTime,
        isOnCalendar
    }) => {
        const [{ isDragging }, drag, preview] = useDrag(() => ({
            type: 'ITEM',
            item: {
                _id,
                title,
                description,
                startTime,
                endTime,
                status,
                priority,
                estimatedTime,
                dueTime,
                style: {
                    backgroundColor,
                    textColor,
                },
                isOnCalendar: isOnCalendar,
            },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        function formatDueTime(isoDate: string): string {
            const date = new Date(isoDate); // Parse ISO string as is

            // Extract individual components
            const day = date.getUTCDate();
            const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }); // Short month name like Dec
            const hours = date.getUTCHours(); // Use UTC hours to match database
            const minutes = date.getUTCMinutes();

            // Final formatted string
            return `${hours}:${minutes.toString().padStart(2, '0')}, ${month} ${day}`;
        }

        // Suppress the default drag preview
        useEffect(() => {
            preview(new Image()); // Use a transparent or empty image
        }, [preview]);

        return (
            <DropdownMenu>
                <div
                    className={cn('relative flex flex-col px-2 py-1.5 space-y-1 dark:bg-slate-600 border rounded-md text-sm hover:cursor-grab shadow-md',)}
                    ref={drag}
                    style={{ opacity: isDragging ? 0.5 : 1 }}
                >
                    {/* Task Header */}
                    <div className='flex text-[11px] truncate'>
                        <p className={cn(`flex items-center font-semibold truncate`)}>
                            <Badge className={`text-white dark:text-black`}>{activity}</Badge>
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
                            Due to: <span className='ml-1'>{dueTime ? formatDueTime((dueTime || '')) : 'Not setup'}</span>
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