///Import frameworks
import React from 'react';
//Import libs
import { cn } from '@/lib/utils';
//Import packages


//Import components

//Import icons
import { FaCheck } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
import { RiProgress5Line } from "react-icons/ri";

type CalendarCellProps = {
    time: string;
    task?: Task;
    date: string;
    className: string;
    style: React.CSSProperties;
    rowSpan: number;
};

const OnlyShownTaskCell: React.FC<CalendarCellProps> = ({
    task,
    className,
}) => {
    return (
        <div
            className={cn(
                `relative flex h-full bg-gray-50`,
                task?.style.backgroundColor,
                className
            )}
        >
            {task && (
                <div className='flex flex-row items-center h-full font-semibold'>
                    {task.status === 'completed' && (
                        <>
                            <div className='flex justify-center items-center bg-emerald-400 w-5 h-full'>
                                <div className='flex justify-center items-center bg-white rounded-full w-4 h-4'>
                                    <FaCheck className='text-emerald-700' />
                                </div>
                            </div>
                            <span className='mx-1 text-[10px]'>-</span>
                            <p className="text-[10px] text-zinc-600 truncate">{task.title}</p>
                        </>
                    )}
                    {task.status === 'in-progress' && (
                        <>
                            <div className='flex justify-center items-center bg-amber-400 w-5 h-full'>
                                <div className='flex justify-center items-center bg-white rounded-full w-4 h-4'>
                                    <RiProgress5Line className='text-amber-700' />
                                </div>
                            </div>
                            <span className='mx-1 text-[10px]'>-</span>
                            <p className="text-[10px] text-zinc-600 truncate">{task.title}</p>
                        </>
                    )}
                    {task.status === 'pending' && (
                        <>
                            <div className='flex justify-center items-center bg-red-400 w-5 h-full'>
                                <div className='flex justify-center items-center bg-white rounded-full w-4 h-4'>
                                    <FcCancel />
                                </div>

                            </div>
                            <span className='mx-1 text-[10px]'>-</span>
                            <p className="text-[10px] text-zinc-600 truncate">{task.title}</p>
                        </>
                    )}
                </div>
            )
            }
        </div>
    );
};

export default OnlyShownTaskCell;
