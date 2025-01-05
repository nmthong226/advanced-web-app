// src/data/tasks.ts

// Define the Task type
export interface Task {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    category: string;
    startTime?: string;
    endTime?: string;
    dueTime?: string;
    estimatedTime: number; // Estimated Pomodoros
    pomodorosCompleted: number; // Pomodoros Completed
    style: {
      backgroundColor: string;
      textColor: string;
    };
    isOnCalendar: boolean;
  }
  
  // Mock data for tasks
  export const mockTasks: Task[] = [
    {
      _id: '1',
      userId: 'user123',
      title: 'Write blog post',
      description: 'Draft the new blog post on React hooks.',
      status: 'in-progress',
      priority: 'high',
      category: 'Work',
      startTime: new Date().toISOString(),
      endTime: new Date(new Date().getTime() + 1500 * 1000).toISOString(),
      dueTime: new Date(new Date().getTime() + 3600 * 1000).toISOString(),
      estimatedTime: 1, // 1 Pomodoro
      pomodorosCompleted: 0, // Initially 0
      style: {
        backgroundColor: '#FFCDD2',
        textColor: '#B71C1C',
      },
      isOnCalendar: true,
    },
    {
      _id: '2',
      userId: 'user123',
      title: 'Read a book',
      description: 'Finish reading "Clean Code" by Robert C. Martin.',
      status: 'pending',
      priority: 'medium',
      category: 'Personal',
      startTime: '',
      endTime: '',
      dueTime: new Date(new Date().getTime() + 7200 * 1000).toISOString(),
      estimatedTime: 2, // 2 Pomodoros
      pomodorosCompleted: 0, // Initially 0
      style: {
        backgroundColor: '#C8E6C9',
        textColor: '#1B5E20',
      },
      isOnCalendar: false,
    },
    // Add more mock tasks as needed
  ];
  