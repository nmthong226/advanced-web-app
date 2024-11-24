// Define a type for Activity and Task
type Activity = {
    id: string;
    title: string;
    description: string;
    type: 'activity';
    startTime: string; 
    endTime: string;
    color: string;
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
