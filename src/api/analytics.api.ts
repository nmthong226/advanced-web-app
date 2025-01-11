import axios, { AxiosInstance, AxiosResponse } from 'axios';
interface FeedbackInterface {
    strengths: string;
    improvements: string;
    motivation: string;
  }
// Define the base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_BACKEND; // Ensure VITE_BACKEND is defined in your .env file

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // You can add more default configurations here if needed
});

// Define TypeScript interfaces for your API responses

// 1. Circle Chart Data
export interface CircleChartData {
  completed: number;
  'in-progress': number;
  pending: number;
  // Add other statuses if any
}

// 2. Weekly Task Counts
export interface WeeklyTaskCounts {
    [date: string]: {
      completed: number;
      'in-progress': number;
      pending: number;
      expired: number;
      timeSpent: number; // Total time spent (in minutes)
      estimatedTime: number; // Total estimated time (in minutes)
    };
  }
  
// 3. Pomodoro Analytics
export interface PomodoroAnalytics {
  weeklyPomodoro: { [date: string]: number };
  activeDays: number;
  totalTimeSpent: number; // in minutes
}

// 4. Session Settings
export interface SessionSettings {
  userId: string;
  date: string; // Format: YYYY-MM-DD
  total_time_spent: number;
  total_time_rest: number;
  task_completed: number;
  tasks_expired: number;
  // Add other fields if necessary
}

// Define API functions

/**
 * Fetch Circle Chart Data by User ID
 * GET /daily-analytics/circle-chart/:user_id
 */
export const fetchCircleChartData = async (userId: string): Promise<CircleChartData> => {
  try {
    console.log(`Fetching Circle Chart Data for User ID: ${userId}`);
    const response: AxiosResponse<CircleChartData> = await api.get(`/daily-analytics/circle-chart/${userId}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Circle Chart Data:', error);
    throw error;
  }
};

/**
 * Fetch Weekly Task Counts by User ID
 * GET /daily-analytics/weekly/:user_id
 */
export const fetchWeeklyTaskCounts = async (userId: string): Promise<WeeklyTaskCounts> => {
  try {
    console.log(`Fetching Weekly Task Counts for User ID: ${userId}`);
    const response: AxiosResponse<WeeklyTaskCounts> = await api.get(`/daily-analytics/weekly/${userId}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Weekly Task Counts:', error);
    throw error;
  }
};

/**
 * Fetch Pomodoro Analytics by User ID
 * GET /daily-analytics/pomodoro-analytics/:user_id
 */
export const fetchPomodoroAnalytics = async (userId: string): Promise<PomodoroAnalytics> => {
  try {
    console.log(`Fetching Pomodoro Analytics for User ID: ${userId}`);
    const response: AxiosResponse<PomodoroAnalytics> = await api.get(`/daily-analytics/pomodoro-analytics/${userId}`);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pomodoro Analytics:', error);
    throw error;
  }
};

/**
 * Update Session Settings by User ID
 * PUT /daily-analytics/update/:user_id
 */
export const updateSessionSettings = async (
  userId: string,
  settings: Partial<SessionSettings>,
): Promise<SessionSettings> => {
  try {
    console.log(`Updating Session Settings for User ID: ${userId}`);
    console.log('Request Data:', settings);
    const response: AxiosResponse<SessionSettings> = await api.put(`/daily-analytics/update/${userId}`, settings);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating Session Settings:', error);
    throw error;
  }
};

export const getAISummary = async (userId: string) => {
    try {
        const response = await axios.get(
        `${API_BASE_URL}/ai-feedbacks/summary-insights/${userId}`
        );
        return response;
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}
export async function fetchAISummaryInsights(userId: string): Promise<FeedbackInterface> {
    const url = `${API_BASE_URL}/ai-feedbacks/summary-insights/${userId}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching AI Summary Insights:', error);
        throw error;
    }
}