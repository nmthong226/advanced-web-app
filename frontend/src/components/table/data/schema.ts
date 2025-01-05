import { z } from 'zod';

export const taskSchema = z.object({
  _id: z.string().optional(), // Optional _id for new tasks, required for existing tasks
  userId: z.string().min(1, 'UserId is required.'), // User ID, required
  title: z.string().min(1, 'Title is required.'), // Task title, required
  description: z.string().optional(), // Optional task description
  status: z.enum(['pending', 'in-progress', 'completed', 'expired'], {
    errorMap: () => ({ message: 'Select a valid status.' }), // Status options with custom error message
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'Select a valid priority.' }), // Priority options with custom error message
  }),
  category: z.string().min(1, 'Category is required.'), // Category, required
  startTime: z
    .string()
    .datetime()
    .optional(), // Optional start time
  endTime: z
    .string()
    .datetime()
    .optional(), // Optional end time
  estimatedTime: z.number().optional(), // Optional estimated time in minutes
  pomodoro_required_number: z.number().min(0, 'Pomodoro required number must be 0 or greater').optional(), // Optional Pomodoro required number
  pomodoro_number: z.number().min(0, 'Pomodoro number must be 0 or greater').optional(), // Optional Pomodoro completed count
  is_on_pomodoro_list: z.boolean().optional(), // Optional flag indicating if the task is on Pomodoro list
  style: z
    .object({
      backgroundColor: z.string().min(1, 'Background color is required.'), // Background color
      textColor: z.string().min(1, 'Text color is required.'), // Text color
    })
    .optional(), // Optional style object with background and text color
});

export type Task = z.infer<typeof taskSchema>;
