import React from "react";
import { BiSolidCircleQuarter } from "react-icons/bi";
import { FaRegCircle, FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";

interface EventProps {
    event: {
        id: string;
        userId: string;
        title: string;
        status: string;
        start: Date;
        end: Date;
    };
}

const CustomEvent: React.FC<EventProps> = ({ event }) => {
    return (
        <div className="flex">
            <p className="line-clamp-1">{event.title}</p>
            <div className="top-0 right-0 absolute flex">
                <div className='flex items-center w-full h-full'>
                    <div className='bg-white hover:bg-slate-200 rounded-full hover:cursor-pointer'>
                        {event.status === 'pending' && (
                            <FaRegCircle className='w-4 h-4 text-purple-700' />
                        )}
                        {event.status === 'in-progress' && (
                            <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                                <div className="flex justify-center items-center rounded-full w-4 h-4">
                                    <BiSolidCircleQuarter className="text-blue-700" />
                                </div>
                            </div>
                        )}
                        {event.status === 'completed' && (
                            <FaRegCircleCheck className='w-4 h-4 text-emerald-700' />
                        )}
                        {event.status === 'expired' && (
                            <FaRegCircleXmark className='w-4 h-4 text-red-700' />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomEvent;
