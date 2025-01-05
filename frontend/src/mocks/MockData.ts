import { ActivitySchedule } from "../types/type";

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
                    bgColor: 'bg-purple-100 border-l-[5px] border-l-purple-600',
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
                    bgColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
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
                    bgColor: 'bg-green-100 border-l-[5px] border-l-green-600',
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
                    bgColor: 'bg-red-100 border-l-[5px] border-l-red-600',
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
                    bgColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
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
                    bgColor: 'bg-indigo-100 border-l-[5px] border-l-indigo-600',
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
                    bgColor: 'bg-pink-100 border-l-[5px] border-l-pink-600',
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