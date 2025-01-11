// src/types/apiResponses.ts

import { SessionMode } from "./sessionsModes";

export interface PomodoroLog {
    user_id: string;
    task_id: string;
    current_pomodoro_number: number;
    current_cycle_number: number;
    required_cycle_number: number;
    start_time: string; // ISO string
    end_time: string;   // ISO string
    session_status: SessionMode;
  }
  
  export interface CurrentPomodoro {
    user_id: string;
    current_pomodoro_number: number;
    current_cycle_number: number;
    total_break_time: number;
    number_sessions: number;
    session_status: SessionMode;
  }
  
  export interface SessionSettings {
    sound_alarm: string;
    sound_break: string;
    user_id: string;
    default_work_time: number;
    default_break_time: number;
    long_break_time: number;
    cycles_per_set: number;
  }
  
  export interface Task {
    _id: string;
    pomodoro_number: number;
    pomodoro_required_number: number;
    // Add other task-related fields as necessary
  }
  