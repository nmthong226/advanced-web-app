import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task as TaskSchema } from "../types/task.ts";
import { Event } from "../types/type.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertTasksToEvents = (tasks: TaskSchema[] = []): Event[] => {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return []; // Return an empty array if tasks is null, undefined, or empty
  }
  return tasks
    .filter(task => task.startTime && task.endTime) // Filter only calendar-relevant tasks
    .map((task) => {
      const startTime = new Date(task.startTime!);
      const endTime = new Date(task.endTime!);

      // Adjust to UTC timezone
      startTime.setUTCMinutes(startTime.getMinutes() + startTime.getTimezoneOffset());
      endTime.setUTCMinutes(endTime.getMinutes() + endTime.getTimezoneOffset());

      return {
        id: task._id as string, // Generate unique IDs
        userId: task.userId,
        title: task.title,
        status: task.status as string,
        category: task.category,
        priority: task.priority,
        start: startTime,
        end: endTime,
        allDay: false, // Assuming tasks are not all-day by default
      };
    });
};