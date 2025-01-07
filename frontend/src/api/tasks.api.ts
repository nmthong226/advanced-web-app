export interface Task {
    _id: string;
    title: string;
    description?: string;
    pomodoro_number: number;
    pomodoro_required_number: number;
    estimatedTime?: number;
    status: string;
    userId: string;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    is_on_pomodoro_list: boolean;
    startTime: string;
    endTime: string;
}

export const updateTaskApi = async (id: string, data: Partial<Task>): Promise<any> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update the task');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };