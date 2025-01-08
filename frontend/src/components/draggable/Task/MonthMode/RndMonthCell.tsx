import React from 'react';
import { useDrop } from 'react-dnd';
import { addMinutesToTime, cn } from '@/lib/utils';
import { Task } from '../../../table/data/schema';

type RndCalendarCellProps = {
  time: string;
  date: Date;
  className: string;
  style: React.CSSProperties;
  rowSpan: number;
  onDrop: (item: Task, time: string, date: Date) => void;
  task?: Task;
};

const RndCalendarCell: React.FC<RndCalendarCellProps> = ({
  date,
  time,
  onDrop,
  style,
  className,
  task,
}) => {
  const [{ isOver, draggingItem }, drop] = useDrop<Task, void, { isOver: boolean; draggingItem: Task | null }>({
    accept: 'ITEM',
    drop: (item) => {
      const updatedEndTime = addMinutesToTime(time, 30); // Updated end time
      // Update the task details
      const updatedItem = {
        ...item,
        startTime: time,
        endTime: updatedEndTime,
        date: date,
        status: item.status, // Mark as expired if true
      };
      // Handle the updated task
      onDrop(updatedItem, time, date);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      draggingItem: monitor.getItem() || null, // Get the dragging item data
    }),
  });

  console.log(task);

  return (
    <div
      ref={drop}
      className={cn(
        `relative flex h-5 justify-between w-[96%] text-[12px] pr-1 ${isOver ? 'bg-indigo-200/20' : ''
        }`
      )}
      style={{
        ...style,
        zIndex: isOver ? 50 : 0,
      }}
    >
      {/* Show the dragging content or fallback values */}
      <p className={cn(`w-[80%] truncate`, task ? className : '')}>
        {isOver ? draggingItem?.title : task?.title}
      </p>
      <p>
        {isOver ? draggingItem?.startTime : task?.startTime}
      </p>
    </div>
  );
};

export default RndCalendarCell;
