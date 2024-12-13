import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { IoIosMore } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { GoTrash } from "react-icons/go";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import NotifyDeletion from '../toast/notifyDeletion';
import { Button } from '../ui/button';
// import EditEventItemsDialog from '../dialogs/editEventItems';
import { cn } from '@/lib/utils';

type DraggableTaskProps = {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    backgroundColor: string;
    textColor: string;
    activity: string;
    status: string;
};

const DraggableTask: React.FC<DraggableTaskProps> = ({ title, status, backgroundColor, textColor, description, startTime, endTime, activity }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: {
            title,
            description,
            startTime,
            endTime,
            status,
            style: {
                backgroundColor,
                textColor,
            },
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <DropdownMenu>
            <div className={cn('relative flex flex-col space-y-1 bg-purple-100 px-2 py-3 border border-l-[5px] border-l-purple-600 rounded-md font-mono text-sm truncate hover:cursor-grab', backgroundColor)} ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
                {/* Task Header */}
                <div className='flex text-[11px] truncate'>
                    <p className='font-bold truncate'>{activity}</p>
                    <p>|</p>
                    <p className='truncate'>{description}</p>
                </div>

                {/* Task Title */}
                <p className='font-bold text-lg truncate'>{title}</p>

                {/* Task Times */}
                <div className='flex flex-col text-[11px] leading-tight'>
                    <p>
                        Start: <span className='ml-1 font-bold'>{startTime}</span>
                    </p>
                    <p>
                        End: <span className='ml-4 font-bold'>{endTime}</span>
                    </p>
                </div>

                {/* Dropdown Menu Trigger */}
                <DropdownMenuTrigger className="top-1/2 right-0 absolute">
                    <IoIosMore className="group-hover:flex top-1/2 right-2 absolute hidden transform -translate-y-1/2 group-hover:cursor-pointer" />
                </DropdownMenuTrigger>

                {/* Dropdown Menu Content */}
                <DropdownMenuContent className=''>
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <div className="flex items-center space-x-2 text-[12px]">
                            <GoPencil className="mr-2 size-3" />
                            Edit
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                        <div className="flex items-center space-x-2 text-[12px]">
                            <GoTrash className="mr-2 size-3" />
                            Delete
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    {/* <EditEventItemsDialog eventCategory={category} eventItem={{ id: '', title, backgroundColor, textColor }} onEditEventItem={() => { }} /> */}
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
        </DropdownMenu>
    );
};

export default DraggableTask;