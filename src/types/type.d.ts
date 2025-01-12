// Define a type for Activity and Task
//Import data schema
import { Task } from './task.ts';

// Types
interface Event {
    _id: string;
    userId: string;
    title: string;
    start: Date;
    end: Date;
    dueDate?: Date;
    allDay?: boolean;
    status: 'pending' | 'in-progress' | 'completed' | 'expired';
    category: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    pomodoro_required_number?: number; // Matches snake_case in Mongoose schema
    pomodoro_number?: number; // Matches snake_case in Mongoose schema
    is_on_pomodoro_list?: boolean; // Matches snake_case in Mongoose schema
}

interface DraggedEvent {
    _id: string;
    userId: string;
    title: string;
    status: 'pending' | 'in-progress' | 'completed' | 'expired';
    category: string;
    priority: 'low' | 'medium' | 'high';
}

interface Task {
    _id: string;
    userId: string;
    title: string;
    category: string;
    status: 'pending' | 'in-progress' | 'completed' | 'expired';
    priority: 'low' | 'medium' | 'high';
}

interface TaskItem {
    _id?: string;
    userId: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'expired';
    priority: 'low' | 'medium' | 'high';
    category: string; // Made optional since Mongoose default is an empty string
    startTime?: string; // Changed to match Mongoose's Date type
    endTime?: string;
    dueTime?: string;
    estimatedTime?: number; // Time needed in minutes
    pomodoro_required_number?: number; // Matches snake_case in Mongoose schema
    pomodoro_number?: number; // Matches snake_case in Mongoose schema
    is_on_pomodoro_list?: boolean; // Matches snake_case in Mongoose schema
    color?: string;
}

type Style = {
    bgColor: string;
    textColor: string;
}

type Activity = {
    id: string;
    userId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    style: Style;
    duration: number;
    relatedItems?: string[];
};

type User = {
    id: string;
    clerkId?: string;
    tasks: Task[];
    eventCategories: EventCategory[];
    activitySchedule: ActivitySchedule[];
    settings?: {
        theme: 'light' | 'dark';
        notifications: boolean;
        language: string;
    };
};

type DraggableTaskProps = {
    _id: string;
    title: string;
    description: string | undefined;
    start: string | undefined;
    end: string | undefined;
    estimatedTime: number | undefined;
    color: string | undefined;
    status: string;
    priority: string;
    isOnCalendar: boolean;
};

export type Appointment = {
    id: number;
    status: string;
    location: string;
    resource: string;
    address: string;
};

export type EventItem = {
    start?: Date | string;
    end?: Date | string;
    data?: { appointment?: Appointment };
    isDraggable?: boolean;
    isResizable?: boolean;
    resourceId?: number;
};