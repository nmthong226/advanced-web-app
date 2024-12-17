import { z } from 'zod'

// Extending the task schema to include description, start date, and end date
export const taskSchema = z.object({
  id: z.string(),
  userId: z.string(), // New field for user association
  title: z.string(),
  description: z.string().optional(), // Optional description field
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  startDate: z.string().optional(), // Optional start date field (you can also use z.date() for actual Date object)
  endDate: z.string().optional(),   // Optional end date field (use z.date() for Date object as well)
  dueTime: z.string().optional(),
  estimatedTime: z.number().optional(),
})

export type Task = z.infer<typeof taskSchema>
