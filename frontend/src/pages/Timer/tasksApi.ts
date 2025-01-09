// src/api/tasksApi.ts

import { TaskItem } from "./tasks";

const BASE_URL = `${import.meta.env.VITE_BACKEND}/tasks`;

/**
 * Updates a task with the given ID and data.
 * @param id - The ID of the task to update.
 * @param data - Partial task data to update.
 * @returns The updated task.
 */
export const updateTaskApi = async (id: string, data: Partial<TaskItem>): Promise<TaskItem> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
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

/**
 * Deletes a task with the given ID.
 * @param id - The ID of the task to delete.
 * @returns A boolean indicating success.
 */
export const deleteTaskApi = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete the task');
    }

    return true; // Return true if successful
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

/**
 * Adds a new task.
 * @param data - The task data to add.
 * @returns The created task.
 */
export const addTaskApi = async (data: Partial<TaskItem>): Promise<TaskItem> => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to add the task');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};
