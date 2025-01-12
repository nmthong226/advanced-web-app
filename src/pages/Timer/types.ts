// src/types.ts

export interface SessionSettings {
    user_id: string;
    default_work_time: number;
    default_break_time: number;
    long_break_time: number;
    cycles_per_set: number;
  }
  
  export interface CurrentPomodoro {
    user_id: string;
    current_pomodoro_number: number;
    current_cycle_number: number;
    session_status: 'pomodoro' | 'short-break' | 'long-break';
  }
  
  export interface PomodoroLog {
    user_id: string; // Changed to string as explained later
    task_id: string;
    current_pomodoro_number: number;
    current_cycle_number: number;
    required_cycle_number: number;
    start_time: string;
    end_time: string;
    session_status: 'pomodoro' | 'short-break' | 'long-break';
  }
  export interface Task {
    _id: string;
    title: string;
    description?: string;
    pomodoro_number: number;
    pomodoro_required_number: number;
    estimatedTime?: number;
    status: 'pending' | 'in-progress' | 'completed';
    userId: string;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    is_on_pomodoro_list: boolean;
  }
  