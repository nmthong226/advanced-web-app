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
                    endTime: '10:00 AM',
                    style: {
                        backgroundColor: 'bg-purple-100 border-l-[5px] border-l-purple-600',
                        textColor: 'text-purple-600',
                    },
                    duration: 60,
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
    },
    {
        date: '25-11-2024',
        dayOfWeek: 'Mon',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '26-11-2024',
        dayOfWeek: 'Tue',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '27-11-2024',
        dayOfWeek: 'Wed',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '28-11-2024',
        dayOfWeek: 'Thu',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '29-11-2024',
        dayOfWeek: 'Fri',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '30-11-2024',
        dayOfWeek: 'Sar',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '25-11-2024',
        dayOfWeek: 'Mon',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '25-11-2024',
        dayOfWeek: 'Mon',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
];
