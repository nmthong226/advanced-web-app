// src/api/focusSessionsApi.ts

import { SessionSettings, CurrentPomodoro, PomodoroLog } from "./types";

const BASE_URL = `${import.meta.env.VITE_BACKEND}/focus-sessions`;

/**
 * Helper function to create headers with Authorization.
 * @param token - The authentication token.
 * @returns Headers object.
 */
const createHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Creates session settings for a user.
 * @param data - The session settings data.
 * @param token - The authentication token.
 * @returns The created session settings.
 */
export const createSessionSettings = async (
  data: SessionSettings,
  token: string
): Promise<SessionSettings> => {
  try {
    const response = await fetch(`${BASE_URL}/session-settings`, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create session settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating session settings:', error);
    throw error;
  }
};

/**
 * Updates session settings for a user.
 * @param user_id - The ID of the user.
 * @param data - Partial session settings data to update.
 * @param token - The authentication token.
 * @returns The updated session settings.
 */
export const updateSessionSettings = async (
  user_id: string,
  data: Partial<SessionSettings>,
  token: string
): Promise<SessionSettings> => {
  try {
    const response = await fetch(`${BASE_URL}/update/${user_id}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update session settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating session settings:', error);
    throw error;
  }
};

/**
 * Retrieves all session settings.
 * @param token - The authentication token.
 * @returns An array of session settings.
 */
export const getAllSessionSettings = async (token: string): Promise<SessionSettings> => {
  try {
    const response = await fetch(`${BASE_URL}/session-settings`, {
      method: 'GET',
      headers: createHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch session settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching session settings:', error);
    throw error;
  }
};

/**
 * Creates a current Pomodoro session.
 * @param data - The current Pomodoro data.
 * @param token - The authentication token.
 * @returns The created current Pomodoro.
 */
export const createCurrentPomodoro = async (
  data: CurrentPomodoro,
  token: string
): Promise<CurrentPomodoro> => {
  try {
    const response = await fetch(`${BASE_URL}/current-pomodoro`, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create current Pomodoro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating current Pomodoro:', error);
    throw error;
  }
};

/**
 * Updates the current Pomodoro session.
 * @param data - The current Pomodoro data to update.
 * @param token - The authentication token.
 * @returns The updated current Pomodoro.
 */
export const updateCurrentPomodoro = async (
  data: CurrentPomodoro,
  user_id: string,
  token: string
): Promise<CurrentPomodoro> => {
  try {
    const response = await fetch(`${BASE_URL}/current-pomodoro/${user_id}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update current Pomodoro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating current Pomodoro:', error);
    throw error;
  }
};

/**
 * Creates a Pomodoro log entry.
 * @param data - The Pomodoro log data.
 * @param token - The authentication token.
 * @returns The created Pomodoro log.
 */
export const createPomodoroLog = async (
  data: PomodoroLog,
  token: string
): Promise<PomodoroLog> => {
  try {
    const response = await fetch(`${BASE_URL}/pomodoro-log`, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create Pomodoro log');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Pomodoro log:', error);
    throw error;
  }
};

/**
 * Retrieves all Pomodoro logs.
 * @param token - The authentication token.
 * @returns An array of Pomodoro logs.
 */
export const getAllPomodoroLogs = async (token: string): Promise<PomodoroLog[]> => {
  try {
    const response = await fetch(`${BASE_URL}/pomodoro-log`, {
      method: 'GET',
      headers: createHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Pomodoro logs');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Pomodoro logs:', error);
    throw error;
  }
};
/**
 * Deletes the CurrentPomodoro record for a specific user.
 * @param user_id - The ID of the user whose CurrentPomodoro is to be deleted.
 * @param token - The authentication token.
 * @returns A success message upon deletion.
 */
export const deleteCurrentPomodoroApi = async (
    user_id: string,
    token: string
  ): Promise<{ message: string; data: any }> => {
    try {
      const response = await fetch(`${BASE_URL}/current-pomodoro/${user_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure you pass the token for authenticated routes
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete CurrentPomodoro.');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error deleting CurrentPomodoro:', error);
      throw error;
    }
  };