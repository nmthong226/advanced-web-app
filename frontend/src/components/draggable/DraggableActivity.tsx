import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
//Import libs
import { cn } from '@/lib/utils';
//Import icons
import { MdDragIndicator } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { GoTrash } from "react-icons/go";

//Import components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import NotifyDeletion from '../toast/notifyDeletion';
import { Button } from '../ui/button';
import EditEventItemsDialog from '../dialogs/editEventItems';

type DraggableActivityProps = {
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
    category: ActivityCategory;
};

const DraggableActivity: React.FC<DraggableActivityProps> = ({ title, type, backgroundColor, textColor, description, startTime, endTime, date, duration, category }) => {
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
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <DropdownMenu>
            <div className='flex items-center group'>
                <MdDragIndicator className="group-hover:visible invisible" />
                <div
                    ref={drag}
                    className={cn(`rounded-md border px-3 py-2 font-mono truncate text-sm w-full relative ${isDragging ? 'opacity-50' : 'opacity-100'}`, backgroundColor)}
                    style={{
                        cursor: 'grab',
                    }}
                >
                    <p className='w-full truncate'>{title}</p>
                    <DropdownMenuTrigger className="top-1/2 right-0 absolute">
                        <IoIosMore className="group-hover:flex top-1/2 right-2 absolute hidden transform -translate-y-1/2 group-hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className=''>
                        {/* Edit Action */}
                        <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                            <div className="flex items-center space-x-2 text-[12px]">
                                <GoPencil className="mr-2 size-3" />
                                Edit
                            </div>
                        </DropdownMenuItem>

                        {/* Delete Action */}
                        <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                            <div className="flex items-center space-x-2 text-[12px]">
                                <GoTrash className="mr-2 size-3" />
                                Delete
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                    {/* Edit Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <EditEventItemsDialog eventCategory={category} eventItem={{ id: '', title, backgroundColor, textColor }} onEditEventItem={() => { }}/>
                    </Dialog>
                    {/* Delete Dialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent className='left-[10%] justify-center p-2 w-[200px]'>
                            <DialogHeader>
                                <DialogTitle className='text-md'>Delete Confirm</DialogTitle>
                                <DialogDescription>
                                    <p className='flex flex-wrap text-sm'>
                                        Delete {title} item?
                                    </p>
                                </DialogDescription>
                            </DialogHeader>
                            <div className='flex items-center space-x-2'>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    className='hover:bg-gray-50 border'
                                >
                                    Cancel
                                </Button>
                                <NotifyDeletion setIsDeleteDialogOpen={setIsDeleteDialogOpen} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </DropdownMenu>

    );
};

export default DraggableActivity;
