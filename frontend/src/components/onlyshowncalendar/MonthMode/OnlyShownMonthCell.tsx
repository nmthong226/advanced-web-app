import { cn } from '@/lib/utils';
import React, { ReactNode, useState } from 'react';

type MonthCellProps = {
    day: Date;
    month: number;
    index: number;
    isToday: boolean;
    formatFullDate: (date: Date) => string;
    children?: ReactNode;
    className?: string;
};

export const OnlyShownMonthCell: React.FC<MonthCellProps> = ({
    day,
    month,
    index,
    isToday,
    formatFullDate,
    children,
    className,
}) => {
    const [isClicked, setIsClicked] = useState(false); // State to track if the cell is clicked
    const childrenArray = React.Children.toArray(children);

    // Determine which children to display
    const visibleChildren = isClicked ? childrenArray : childrenArray.slice(0, 4);
    const hiddenChildrenCount = isClicked ? 0 : childrenArray.length - visibleChildren.length;

    return (
        <div
            key={index}
            className={cn(
                `relative flex flex-col border dark:border-gray-500  
                ${index % 7 === 6 ? '' : 'border-r-0'} 
                ${
                    day.getMonth() === month
                        ? 'bg-white dark:bg-slate-800' // Highlight current month's days
                        : 'bg-gray-100 dark:bg-slate-900'
                }`,
                className
            )}
            onClick={() => setIsClicked(!isClicked)} // Toggle click state on click
        >
            <div className="flex rounded-sm font-semibold text-gray-700 text-nowrap dark:text-gray-300">
                <p
                    className={`${
                        isToday ? 'bg-indigo-600 text-white' : ''
                    } px-1 rounded-md text-[11px] ${
                        day.getDate() === 1
                            ? 'text-indigo-600 font-semibold'
                            : ''
                    }`}
                >
                    {day.getDate() === 1
                        ? formatFullDate(day)
                        : day.getDate()}
                </p>
            </div>
            <div
                className={cn(
                    'relative flex flex-col gap-0.5 custom-scrollbar',
                    isClicked ? 'overflow-y-auto' : 'overflow-hidden'
                )} // Conditionally apply overflow classes
            >
                {visibleChildren}
                {hiddenChildrenCount > 0 && !isClicked && (
                    <div className="text-[12px] text-center hover:text-indigo-600 hover:cursor-pointer">
                        {hiddenChildrenCount} more
                    </div>
                )}
            </div>
        </div>
    );
};
