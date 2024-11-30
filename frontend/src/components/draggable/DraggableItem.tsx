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
} from "../../components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import NotifyDeletion from '../toast/notifyDeletion';
import { Button } from '../ui/button';
import EditEventItemsDialog from '../dialogs/editEventItems';

type DraggableItemProps = {
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
    category: DefinedEvents;
};

const DraggableItem: React.FC<DraggableItemProps> = ({ title, type, backgroundColor, textColor, description, startTime, endTime, date, duration, category }) => {
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
                <MdDragIndicator className="invisible group-hover:visible" />
                <div
                    ref={drag}
                    className={cn(`rounded-md border px-3 py-2 font-mono truncate text-sm w-full relative ${isDragging ? 'opacity-50' : 'opacity-100'}`, backgroundColor)}
                    style={{
                        cursor: 'grab',
                    }}
                >
                    <p className='w-full truncate'>{title}</p>
                    <DropdownMenuTrigger className="absolute right-0 top-1/2">
                        <IoIosMore className="absolute right-2 top-1/2 transform -translate-y-1/2 hidden group-hover:flex group-hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className=''>
                        {/* Edit Action */}
                        <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                            <div className="flex space-x-2 items-center text-[12px]">
                                <GoPencil className="mr-2 size-3" />
                                Edit
                            </div>
                        </DropdownMenuItem>

                        {/* Delete Action */}
                        <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                            <div className="flex space-x-2 items-center text-[12px]">
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
                        <DialogContent className='w-[200px] left-[10%] p-2 justify-center'>
                            <DialogHeader>
                                <DialogTitle className='text-md'>Delete Confirm</DialogTitle>
                                <DialogDescription>
                                    <p className='flex flex-wrap text-sm'>
                                        Delete {title} item?
                                    </p>
                                </DialogDescription>
                            </DialogHeader>
                            <div className='flex space-x-2 items-center'>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsDeleteDialogOpen(false)}
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

export default DraggableItem;
