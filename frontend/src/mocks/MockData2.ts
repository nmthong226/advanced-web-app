export const initialCalendarData: CalendarData = [
    {
        date: '24-11-2024',
        dayOfWeek: 'Sun',
        schedule: {
            activies: [
                {
                    id: 'activity-1',
                    title: 'Your course here',
                    description: 'your description here',
                    type: 'activity',
                    startTime: '7:00 AM',
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
                    title: 'Homework here',
                    description: 'your description here',
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
            activies: [
                {
                    id: 'activity-2',
                    title: 'Learn NestJS - Basics',
                    description: 'Introduction to NestJS and setting up the environment.',
                    type: 'activity',
                    startTime: '7:00 AM',
                    endTime: '10:00 AM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 180,
                },
                {
                    id: 'activity-3',
                    title: 'Learn NestJS - Controllers & Routing',
                    description: 'Understanding controllers and routing in NestJS.',
                    type: 'activity',
                    startTime: '1:30 PM',
                    endTime: '5:00 PM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 210,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '26-11-2024',
        dayOfWeek: 'Tue',
        schedule: {
            activies: [
                {
                    id: 'activity-4',
                    title: 'Learn NestJS - Dependency Injection',
                    description: 'Understand and implement dependency injection in NestJS.',
                    type: 'activity',
                    startTime: '7:00 AM',
                    endTime: '10:00 AM',
                    style: {
                        backgroundColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
                        textColor: 'text-yellow-600',
                    },
                    duration: 180,
                },
                {
                    id: 'activity-5',
                    title: 'Learn NestJS - Modules',
                    description: 'Explore modules and their usage in NestJS projects.',
                    type: 'activity',
                    startTime: '1:30 PM',
                    endTime: '5:00 PM',
                    style: {
                        backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                        textColor: 'text-red-600',
                    },
                    duration: 210,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '27-11-2024',
        dayOfWeek: 'Wed',
        schedule: {
            activies: [
                {
                    id: 'activity-6',
                    title: 'Learn NestJS - Middleware',
                    description: 'Implement middleware for request handling in NestJS.',
                    type: 'activity',
                    startTime: '7:00 AM',
                    endTime: '10:00 AM',
                    style: {
                        backgroundColor: 'bg-purple-100 border-l-[5px] border-l-purple-600',
                        textColor: 'text-purple-600',
                    },
                    duration: 180,
                },
                {
                    id: 'activity-7',
                    title: 'Learn NestJS - Pipes',
                    description: 'Understand pipes and their use cases in NestJS.',
                    type: 'activity',
                    startTime: '1:30 PM',
                    endTime: '5:00 PM',
                    style: {
                        backgroundColor: 'bg-indigo-100 border-l-[5px] border-l-indigo-600',
                        textColor: 'text-indigo-600',
                    },
                    duration: 210,
                },
            ],
            tasks: [
                {
                    id: 'task-4',
                    title: 'Create Custom Middleware',
                    description: 'Develop and test a custom middleware.',
                    type: 'task',
                    dueTime: '12:00 PM',
                    status: 'pending',
                },
            ],
        },
    },
    {
        date: '28-11-2024',
        dayOfWeek: 'Thu',
        schedule: {
            activies: [
                {
                    id: 'activity-8',
                    title: 'Learn NestJS - Services',
                    description: 'Build and use services effectively in NestJS.',
                    type: 'activity',
                    startTime: '7:00 AM',
                    endTime: '10:00 AM',
                    style: {
                        backgroundColor: 'bg-orange-100 border-l-[5px] border-l-orange-600',
                        textColor: 'text-orange-600',
                    },
                    duration: 180,
                },
                {
                    id: 'activity-9',
                    title: 'Learn NestJS - Guards & Interceptors',
                    description: 'Dive into advanced topics like guards and interceptors.',
                    type: 'activity',
                    startTime: '1:30 PM',
                    endTime: '5:00 PM',
                    style: {
                        backgroundColor: 'bg-teal-100 border-l-[5px] border-l-teal-600',
                        textColor: 'text-teal-600',
                    },
                    duration: 210,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '29-11-2024',
        dayOfWeek: 'Fri',
        schedule: {
            activies: [
                {
                    id: 'activity-10',
                    title: 'Learn NestJS - Testing',
                    description: 'Explore unit and integration testing in NestJS.',
                    type: 'activity',
                    startTime: '7:00 AM',
                    endTime: '10:00 AM',
                    style: {
                        backgroundColor: 'bg-gray-100 border-l-[5px] border-l-gray-600',
                        textColor: 'text-gray-600',
                    },
                    duration: 180,
                },
                {
                    id: 'activity-11',
                    title: 'Review and Practice',
                    description: 'Recap the week’s lessons and practice coding.',
                    type: 'activity',
                    startTime: '1:30 PM',
                    endTime: '5:00 PM',
                    style: {
                        backgroundColor: 'bg-cyan-100 border-l-[5px] border-l-cyan-600',
                        textColor: 'text-cyan-600',
                    },
                    duration: 210,
                },
            ],
            tasks: [],
        },
    },
];
