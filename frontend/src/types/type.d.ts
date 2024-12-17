// Define a type for Activity and Task
//Import data schema
import { Task } from '../components/table/data/schema.ts';

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

type EventItem = {
    id: string;
    title: string;
    backgroundColor: string;
    textColor: string;
};

type EventCategory = {
    id: string;
    name: string;
    item: EventItem[];
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
    // activities: Activity[]; expand later for activity management
};