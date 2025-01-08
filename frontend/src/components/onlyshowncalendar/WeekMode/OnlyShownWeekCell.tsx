///Import frameworks
import React, { useState } from 'react';
//Import libs
import { cn } from '@/lib/utils';
//Import packages

//Import components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"

//Import icons
import { Button } from '../../ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '../../ui/input';
import NotifyDeletion from '../../toast/notifyDeletion';
import { LuSave } from 'react-icons/lu';
import { Task } from '../../table/data/schema';
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegCircle } from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";
import { BiSolidCircleQuarter } from "react-icons/bi";

type CalendarCellProps = {
  time: string;
  task?: Task;
  date: string;
  className: string;
  style: React.CSSProperties;
  rowSpan: number;
};

const OnlyShownCalendarCell: React.FC<CalendarCellProps> = ({
  date,
  task,
  className,
  rowSpan,
}) => {
  // Helper function to convert 12-hour time (e.g., "8:00 AM") to 24-hour format (e.g., "08:00")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div
      className={cn(
        `relative flex h-full w-full bg-gray-50 dark:bg-slate-800`,
        className,
      )}
    >
      {task && (

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild className='hover:cursor-pointer'>
            {rowSpan === 1 ? (
              <div
                className={`flex flex-row items-center space-x-1 justify-start h-full w-[96%] rounded-md shadow-md font-semibold bg-indigo-50 dark:bg-slate-700 border-[1px] border-black/30`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger className='outline-none'>
                    <div className='flex items-center space-x-1 w-full h-full'>
                      <div className='hover:bg-slate-200 px-0.5 hover:cursor-pointer'>
                        {task.status === 'pending' && (
                          <FaRegCircle className='text-purple-700' />
                        )}
                        {task.status === 'in-progress' && (
                          <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                            <div className="flex justify-center items-center rounded-full w-4 h-4">
                              <BiSolidCircleQuarter className="text-blue-700" />
                            </div>
                          </div>
                        )}
                        {task.status === 'completed' && (
                          <FaRegCircleCheck className='text-emerald-700' />
                        )}
                        {task.status === 'expired' && (
                          <FaRegCircleXmark className='text-red-700' />
                        )}
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='space-y-1'>
                    <DropdownMenuItem className='flex items-center space-x-2 bg-purple-100 w-full h-full'>
                      <FaRegCircle className='text-purple-700' />
                      <p className='text-xs'>Pending</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center space-x-2 bg-blue-100 w-full h-full'>
                      <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                        <div className="flex justify-center items-center rounded-full w-4 h-4">
                          <BiSolidCircleQuarter className="text-blue-700" />
                        </div>
                      </div>
                      <p className='text-xs'>In-progress</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center space-x-2 bg-emerald-100 w-full h-full'>
                      <FaRegCircleCheck className='text-emerald-700' />
                      <p className='text-xs'>Completed</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center space-x-2 bg-red-100 w-full h-full'>
                      <FaRegCircleXmark className='text-red-700' />
                      <p className='text-xs'>Cancelled</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-[10px] text-zinc-600 truncate">
                  {task.title}
                </p>
                {/* <FaFlagCheckered className='top-1 right-4 absolute size-3'/> */}
              </div>
            ) : (
              <div className={`flex flex-col py-0.5 space-x-1 space-y-0.5 justify-start h-full w-[96%] rounded-md shadow-md font-semibold bg-indigo-50 border-[1px] border-black/30`}>
                <div className='flex space-x-1'>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='outline-none'>
                      <div className='flex items-center space-x-1 w-full h-full'>
                        <div className='hover:bg-slate-200 px-0.5 hover:cursor-pointer'>
                          {task.status === 'pending' && (
                            <FaRegCircle className='text-purple-700' />
                          )}
                          {task.status === 'in-progress' && (
                            <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                              <div className="flex justify-center items-center rounded-full w-4 h-4">
                                <BiSolidCircleQuarter className="text-blue-700" />
                              </div>
                            </div>
                          )}
                          {task.status === 'completed' && (
                            <FaRegCircleCheck className='text-emerald-700' />
                          )}
                          {task.status === 'expired' && (
                            <FaRegCircleXmark className='text-red-700' />
                          )}
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='space-y-1'>
                      <DropdownMenuItem className='flex items-center space-x-2 bg-purple-100 w-full h-full'>
                        <FaRegCircle className='text-purple-700' />
                        <p className='text-xs'>Pending</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='flex items-center space-x-2 bg-blue-100 w-full h-full'>
                        <div className="flex justify-center items-center border-2 border-blue-700 rounded-full w-4 h-4 hover:cursor-pointer">
                          <div className="flex justify-center items-center rounded-full w-4 h-4">
                            <BiSolidCircleQuarter className="text-blue-700" />
                          </div>
                        </div>
                        <p className='text-xs'>In-progress</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='flex items-center space-x-2 bg-emerald-100 w-full h-full'>
                        <FaRegCircleCheck className='text-emerald-700' />
                        <p className='text-xs'>Completed</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='flex items-center space-x-2 bg-red-100 w-full h-full'>
                        <FaRegCircleXmark className='text-red-700' />
                        <p className='text-xs'>Cancelled</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <p className={`font-semibold text-[12px] text-zinc-600 leading-tight ${task.status === 'completed' && 'line-through'}`}>
                    {task.title}
                  </p>
                </div>
                <p className='text-[10px]'>{task.startTime} - {task.endTime}</p>
              </div>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-semibold text-sm">
                Task: {task?.title} in {date}
              </DialogTitle>
              <DialogDescription>
                Check for this task in your calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="gap-4 grid py-4">
              <div className="items-center gap-4 grid grid-cols-4">
                <Label
                  htmlFor="name"
                  className="font-semibold text-[12px] text-left"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  value={task?.title}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="items-center gap-4 grid grid-cols-4">
                <Label
                  htmlFor="username"
                  className="font-semibold text-[12px] text-left"
                >
                  Due Time
                </Label>
                <Input
                  id="time"
                  value={task.dueTime + ', ' + date}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="items-center gap-4 grid grid-cols-4">
                <Label
                  htmlFor="username"
                  className="font-semibold text-[12px] text-left"
                >
                  Duration
                </Label>
                <Input
                  id="duration"
                  value={
                    task?.estimatedTime === 0
                      ? 'None'
                      : task.estimatedTime + ' minutes'
                  }
                  className="col-span-3"
                  disabled
                />
              </div>
              <hr />
              <div className="items-center gap-4 grid grid-cols-4">
                <Label
                  htmlFor="username"
                  className="font-semibold text-[12px] text-left"
                >
                  <div className="flex flex-col">
                    <p>Status</p>
                  </div>
                </Label>
                <Select value={task.status}>
                  <SelectTrigger className="col-span-3 capitalize">
                    <SelectValue placeholder={task.status} />
                  </SelectTrigger>
                  <SelectContent className="col-span-3 capitalize">
                    <SelectGroup>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In-progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-between w-full">
                <NotifyDeletion setIsDeleteDialogOpen={setIsEditDialogOpen} />
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-50 border font-normal text-gray-400 hover:text-gray-600"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant={'outline'}
                    className="items-center"
                  >
                    <LuSave />
                    Save changes
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OnlyShownCalendarCell;
