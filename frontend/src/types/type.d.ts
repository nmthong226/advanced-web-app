// Define a type for Activity and Task
//Import data schema
import { Task } from './task.d.ts';

// Types
interface Event {
    id: string;
    userId: string;
    title: string;
    start: Date;
    end: Date;
    dueDate?: Date;
    allDay?: boolean;
    status: string;
    category?: string;
    description?: string;
    priority?: string | undefined;
}

interface DraggedEvent {
    _id: string;
    userId: string;
    title: string;
    status: string;
    category: string;
}

interface Task {
    _id: string;
    userId: string;
    title: string;
    category: string;
    status: string;
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

//This goes for tasks scheduling
type TaskSchedule = {
    userId: string;
    date: string; // e.g., '2024-11-20'
    dayOfWeek: string; // e.g., 'Wed'
    tasks: Task[];
};

//This goes for timetable
type ActivitySchedule = {
    date: string; // e.g., '2024-11-20'
    dayOfWeek: string; // e.g., 'Wed'
    activities: Activity[];
}

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