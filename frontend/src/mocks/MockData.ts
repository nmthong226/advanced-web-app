export const initialActivityData: ActivitySchedule[] = [
    {
        date: '08-12-2024',
        dayOfWeek: 'Sun',
        activities: [
            {
                id: 'activity-1',
                title: 'Your course here',
                description: 'your description here',
                startTime: '7:00 AM',
                endTime: '10:00 AM',
                style: {
                    backgroundColor: 'bg-purple-100 border-l-[5px] border-l-purple-600',
                    textColor: 'text-purple-600',
                },
                duration: 180,
                userId: 'user-1',
            },
            {
                id: 'activity-2',
                title: 'Your course here',
                description: 'your description here',
                startTime: '10:00 AM',
                endTime: '12:00 AM',
                style: {
                    backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                    textColor: 'text-blue-600',
                },
                duration: 120,
                userId: 'user-1',
            }
        ],
    },
    {
        date: '09-12-2024',
        dayOfWeek: 'Mon',
        activities: [
            {
                id: 'activity-3',
                title: 'Your course here',
                description: 'your description here',
                startTime: '7:00 AM',
                endTime: '10:00 AM',
                style: {
                    backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                    textColor: 'text-green-600',
                },
                duration: 180,
                userId: 'user-1',
            },
        ]
    },
    {
        date: '10-12-2024',
        dayOfWeek: 'Tue',
        activities: [],
    },
    {
        date: '11-12-2024',
        dayOfWeek: 'Wed',
        activities: [
            {
                id: 'activity-4',
                title: 'Your course here',
                description: 'your description here',
                startTime: '7:00 AM',
                endTime: '10:00 AM',
                style: {
                    backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                    textColor: 'text-red-600',
                },
                duration: 180,
                userId: 'user-1',
            }]
    },
    {
        date: '12-12-2024',
        dayOfWeek: 'Thu',
        activities: [
            {
                id: 'activity-5',
                title: 'Your course here',
                description: 'your description here',
                startTime: '7:00 AM',
                endTime: '10:00 AM',
                style: {
                    backgroundColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
                    textColor: 'text-yellow-600',
                },
                duration: 180,
                userId: 'user-1',
            }
        ]
    },
    {
        date: '13-12-2024',
        dayOfWeek: 'Fri',
        activities: [
            {
                id: 'activity-6',
                title: 'Your course here',
                description: 'your description here',
                startTime: '7:00 AM',
                endTime: '10:00 AM',
                style: {
                    backgroundColor: 'bg-indigo-100 border-l-[5px] border-l-indigo-600',
                    textColor: 'text-indigo-600',
                },
                duration: 180,
                userId: 'user-1',
            }
        ]
    },
    {
        date: '14-12-2024',
        dayOfWeek: 'Sat',
        activities: [
            {
                id: 'activity-7',
                title: 'Your course here',
                description: 'your description here',
                startTime: '7:00 AM',
                endTime: '10:00 AM',
                style: {
                    backgroundColor: 'bg-pink-100 border-l-[5px] border-l-pink-600',
                    textColor: 'text-pink-600',
                },
                duration: 180,
                userId: 'user-1',
            }
        ]
    },
    {
        date: '15-12-2024',
        dayOfWeek: 'Sun',
        activities: [],
    }
];

export const userTask: Task[] = [
    {
        id: 'task-1',
        userId: 'user-1',
        title: 'Homework HW3',
        description: 'your description here',
        dueTime: '2024-12-13T08:00:00.000Z',
        startTime: '',
        endTime: '',
        estimatedTime: 0,
        status: 'pending',
        priority: 'high',
        style: {
            backgroundColor: 'bg-gradient-to-b from-white to-blue-100',
            textColor: 'text-blue-600',
        },
        category: 'Web Development',
    },
    {
        id: 'task-2',
        title: 'Homework here',
        description: 'your description here',
        dueTime: '2024-12-12T10:00:00.000Z',
        startTime: '',
        endTime: '',
        priority: 'medium',
        status: 'in-progress',
        userId: 'user-1',
        estimatedTime: 0,
        style: {
            backgroundColor: 'bg-gradient-to-b from-white to-green-100',
            textColor: 'text-green-600',
        },
        category: 'Intro2SE',
    },
    {
        id: 'task-3',
        title: 'Homework here',
        description: 'your description here',
        dueTime: '2024-12-11T09:00:00.000Z',
        startTime: '',
        endTime: '',
        priority: 'low',
        status: 'completed',
        userId: 'user-1',
        estimatedTime: 0,
        style: {
            backgroundColor: 'bg-gradient-to-b from-white to-red-100',
            textColor: 'text-red-600',
        },
        category: 'Game Dev',
    }
]

export const initialTaskData: TaskSchedule[] = [
    {
        date: '08-12-2024',
        dayOfWeek: 'Sun',
        userId: 'user-1',
        tasks: [],
    },
    {
        date: '09-12-2024',
        dayOfWeek: 'Mon',
        userId: 'user-1',
        tasks: [],
    },
    {
        date: '10-12-2024',
        dayOfWeek: 'Tue',
        userId: 'user-1',
        tasks: [],
    },
    {
        date: '11-12-2024',
        dayOfWeek: 'Wed',
        userId: 'user-1',
        tasks: [
            {
                id: 'task-3',
                title: 'Homework here',
                description: 'your description here',
                dueTime: '9:00 AM',
                startTime: '',
                endTime: '8:00 AM',
                priority: 'low',
                status: 'completed',
                userId: 'user-1',
                estimatedTime: 0,
                style: {
                    backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                    textColor: 'text-green-600',
                },
                category: 'none',
            }
        ]
    },
    {
        date: '12-12-2024',
        dayOfWeek: 'Thu',
        userId: 'user-1',
        tasks: [],
    },
    {
        date: '13-12-2024',
        dayOfWeek: 'Fri',
        userId: 'user-1',
        tasks: [],
    },
    {
        date: '14-12-2024',
        dayOfWeek: 'Sat',
        userId: 'user-1',
        tasks: [],
    },
];

export const mockUserEvents: EventCategory[] = [
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
] as EventCategory[];