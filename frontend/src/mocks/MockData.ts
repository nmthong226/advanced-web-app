export const initialCalendarData: CalendarData = [
    {
        date: '01-12-2024',
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
        date: '02-12-2024',
        dayOfWeek: 'Mon',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '03-12-2024',
        dayOfWeek: 'Tue',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '04-12-2024',
        dayOfWeek: 'Wed',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '05-12-2024',
        dayOfWeek: 'Thu',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '06-12-2024',
        dayOfWeek: 'Fri',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
    {
        date: '07-12-2024',
        dayOfWeek: 'Sar',
        schedule: {
            activies: [],
            tasks: [],
        }
    },
];

export const mockUserEvents: UserEvent = [
    {
        id: "1",
        name: "Courses",
        item: [
            {
                id: "1",
                title: "Economics",
                backgroundColor: "bg-purple-100 border-l-[5px] border-l-purple-600",
                textColor: "text-purple-500"
            },
            {
                id: "2",
                title: "Math",
                backgroundColor: "bg-cyan-100 border-l-[5px] border-l-cyan-600",
                textColor: "text-cyan-500"
            },
            {
                id: "3",
                title: "History",
                backgroundColor: "bg-orange-100 border-l-[5px] border-l-orange-600",
                textColor: "text-orange-500"
            },
            {
                id: "4",
                title: "Psychology",
                backgroundColor: "bg-pink-100 border-l-[5px] border-l-pink-600",
                textColor: "text-pink-500"
            },
            {
                id: "5",
                title: "Game development",
                backgroundColor: "bg-green-100 border-l-[5px] border-l-green-600",
                textColor: "text-green-500"
            },
            {
                id: "6",
                title: "Advanced Web Application Development",
                backgroundColor: "bg-sky-100 border-l-[5px] border-l-sky-600",
                textColor: "text-sky-500"
            },
        ],
    },
    {
        id: "2",
        name: "Activities",
        item: [
            {
                id: "7",
                title: "Morning Routine",
                backgroundColor: "bg-red-50 border-l-[5px] border-l-red-600",
                textColor: "text-red-500"
            },
            {
                id: "8",
                title: "Lunch",
                backgroundColor: "bg-yellow-50 border-l-[5px] border-l-yellow-600",
                textColor: "text-yellow-500"
            },
            {
                id: "9",
                title: "Power Nap",
                backgroundColor: "bg-red-100 border-l-[5px] border-l-red-600",
                textColor: "text-indigo-500"
            },
            {
                id: "10",
                title: "Dinner",
                backgroundColor: "bg-gray-50 border-l-[5px] border-l-gray-600",
                textColor: "text-gray-500"
            },
            {
                id: "11",
                title: "Me Time",
                backgroundColor: "bg-red-50 border-l-[5px] border-l-red-600",
                textColor: "text-red-500"
            },
            {
                id: "12",
                title: "Bedtime Routine",
                backgroundColor: "bg-yellow-50 border-l-[5px] border-l-yellow-600",
                textColor: "text-yellow-500"
            },
            {
                id: "13",
                title: "Laundry",
                backgroundColor: "bg-pink-50 border-l-[5px] border-l-pink-600",
                textColor: "text-pink-500"
            },
            {
                id: "14",
                title: "Brunch",
                backgroundColor: "bg-violet-50 border-l-[5px] border-l-violet-600",
                textColor: "text-violet-500"
            },
        ],
    },
] as UserEvent;