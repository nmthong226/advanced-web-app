export const initialCalendarData: CalendarData = [
    {
        date: '24-11-2024',
        dayOfWeek: 'Sun',
        schedule:
        {
            activies: [
                {
                    id: 'activity-1',
                    title: 'Standup',
                    description: 'Team standup meeting to discuss daily goals.',
                    type: 'activity',
                    startTime: '9:00 AM',
                    endTime: '9:30 AM',
                    color: 'bg-purple-100 border-l-[5px] border-l-purple-600',
                    duration: 30,
                },
            ],
            tasks: [
                {
                    id: 'task-1',
                    title: 'Code Review',
                    description: 'Review the code for the latest PR.',
                    type: 'task',
                    dueTime: '12:00 PM',
                    status: 'pending',
                },
            ],
        },
        // Add more slots if needed
    },
    // Add more days if needed
];
