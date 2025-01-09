
export const updateUserAPI = async (userId: string, data: any): Promise<any> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/${userId}`, {
        method: 'PUT',
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

  export const getUserAPI = async (userId: string): Promise<any> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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