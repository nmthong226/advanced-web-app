import { z } from 'zod'

export const taskSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(), // Field for associating the task with a user
  title: z.string(),
  description: z.string().optional(), // Optional task description
  status: z.string().optional(), // Restrict to valid statuses
  priority: z.string().optional(), // Restrict to valid priorities
  category: z.string().optional(), // Restrict to valid categories
  startTime: z.string().datetime().optional(), // Optional ISO 8601 date string
  endTime: z.string().datetime().optional(),   // Optional ISO 8601 date string
  dueTime: z.string().datetime().optional(),  // Optional ISO 8601 date string
  estimatedTime: z.number().optional(), // Time in minutes (optional)
  color: z.string().optional(),
  // isOnCalendar: z.boolean()
});

export type Task = z.infer<typeof taskSchema>