///Import frameworks
import React from 'react';
//Import libs
import { cn, formatTimeRange } from '@/lib/utils';

type CalendarCellProps = {
    time: string;
    activity?: Activity;
    date: string;
    className: string;
    style: React.CSSProperties;
    rowSpan: number;
};

const OnlyShownCalendarCell: React.FC<CalendarCellProps> = ({
    activity,
    className,
    rowSpan
}) => {
    return (
        <div
            className={cn(
                `relative flex h-full bg-gray-50 p-1'}`,
                activity?.style.backgroundColor,
                className
            )}
        >
            {activity && (
                <div>
                    {rowSpan === 1 ?
                        (
                            <div className='flex flex-row justify-center items-center'>
                                <p className={cn(`text-[10px] font-semibold`, activity.style.textColor)}>
                                    {activity ? formatTimeRange(activity.startTime, activity.endTime) : ''}
                                </p>
                                <span className='mx-1'> - </span>
                                <p className="font-bold text-[10px] text-zinc-600 truncate">{activity.title}</p>
                            </div>
                        ) : (
                            <div className='flex flex-col p-2 w-full h-full'>
                                <p className={cn(`text-[10px] font-semibold`, activity.style.textColor)}>
                                    {activity ? formatTimeRange(activity.startTime, activity.endTime) : ''}
                                </p>
                                <p className="line-clamp-2 font-semibold text-sm text-zinc-600">{activity.title}</p>
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
};

export default OnlyShownCalendarCell;
