import { z } from 'zod'

export const taskSchema = z.object({
  _id: z.string(),
  userId: z.string(), // Field for associating the task with a user
  title: z.string(),
  description: z.string().optional(), // Optional task description
  status: z.enum(['pending', 'in-progress', 'completed', 'expired']), // Restrict to valid statuses
  priority: z.enum(['high', 'medium', 'low']), // Restrict to valid priorities
  category: z.string(), // Restrict to valid categories
  startTime: z.string().datetime().optional(), // Optional ISO 8601 date string
  endTime: z.string().datetime().optional(),   // Optional ISO 8601 date string
  dueTime: z.string().datetime().optional(),  // Optional ISO 8601 date string
  estimatedTime: z.number().optional(), // Time in minutes (optional)
  style: z.object({ // Object for task styles
    backgroundColor: z.string(), // Background color
    textColor: z.string() // Text color
  })
});

export type Task = z.infer<typeof taskSchema>