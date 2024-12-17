// Define a type for Activity and Task
type Style = {
    backgroundColor: string;
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

type Task = {
    id: string;
    userId: string;
    title: string;
    description: string;
    status?: 'pending' | 'in-progress' | 'completed' | 'expired';
    priority: 'high' | 'medium' | 'low';
    category: string;
    style: Style;
    startTime?: string;
    endTime?: string;
    dueTime: string;
    estimatedTime: number;
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
    name: string;
    email: string;
    avatar?: string;
    taskSchedule: TaskSchedule[];
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