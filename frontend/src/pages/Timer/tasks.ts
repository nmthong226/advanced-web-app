// src/data/tasks.ts

// Define the Task type
// src/components/tasks.ts

export interface Task {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'expired';
    priority: 'low' | 'medium' | 'high';
    category?: string; // Made optional since Mongoose default is an empty string
    startTime?: Date; // Changed to match Mongoose's Date type
    endTime?: Date;
    dueTime?: Date;
    estimatedTime?: number; // Time needed in minutes
    pomodoro_required_number: number; // Matches snake_case in Mongoose schema
    pomodoro_number: number; // Matches snake_case in Mongoose schema
    is_on_pomodoro_list: boolean; // Matches snake_case in Mongoose schema
    style?: {
      backgroundColor: string;
      textColor: string;
    };
  }
  
  
 