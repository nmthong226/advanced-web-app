// src/api/pomodoroSettingsApi.ts

import { SessionSettings } from 'src/types/apiResponses';


const API_BASE_URL= `${import.meta.env.VITE_BACKEND}`;

export const getSessionSettingsApi = async (token: string): Promise<SessionSettings> => {
    const response = await fetch(`${API_BASE_URL}/focus-sessions/session-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token here
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch session settings');
    }
  
    const data: SessionSettings = await response.json();
    return data;
  };

// Function to update session settings for a user
export const updateSessionSettingsApi = async (userId: string, token:string, updatedSettings: Partial<SessionSettings>): Promise<SessionSettings> => {
  const response = await fetch(`${API_BASE_URL}/focus-sessions/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include the token here
    },
    body: JSON.stringify({ user_id: userId, ...updatedSettings }),
  });

  if (!response.ok) {
    throw new Error('Failed to update session settings');
  }

  const data: SessionSettings = await response.json();
  return data;
};
