// Define a type for Activity and Task
type Style = {
    backgroundColor: string;
    textColor: string;
}

type Activity = {
    id: string;
    title: string;
    description: string;
    type: 'activity';
    startTime: string;
    endTime: string;
    style: Style;
    duration: number;
};

type Task = {
    id: string;
    title: string;
    description: string;
    type: 'task'; // Differentiates from activity
    dueTime: string; // e.g., '03:00 PM'
    status: 'pending' | 'in-progress' | 'completed';
};

type Schedule = {
    activies: Activity[];
    tasks: Task[];
};

type DaySchedule = {
    date: string; // e.g., '2024-11-20'
    dayOfWeek: string; // e.g., 'Wed'
    schedule: Schedule;
};

// Main calendar data type
type CalendarData = DaySchedule[];

type ItemEvent = {
    id: string;
    title: string;
    backgroundColor: string;
    textColor: string;
};

type DefinedEvents = {
    id: string;
    name: string;
    item: ItemEvent[];
};

type UserEvent = DefinedEvents[];

type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    calendar: CalendarData;
    events: UserEvent;
    settings?: {
        theme: 'light' | 'dark';
        notifications: boolean;
        language: string;
    };
};