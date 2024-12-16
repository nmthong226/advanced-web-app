export class Task {
    id: string; // Unique task ID
    userId: string; // The ID of the user the task belongs to
    title: string; // Title of the task
    description: string; // Description of the task
    label: string; // Label to categorize the task (e.g., 'bug', 'feature')
    priority: 'low' | 'medium' | 'high'; // Priority level
    status: 'pending' | 'in-progress' | 'completed' | 'expired';// Current status
    startDate: string; // Start date in ISO format
    endDate: string; // End date in ISO format
    dueTime: string; // Due time in ISO format
    estimatedTime: number; // Estimated time in hours
  }
  