export const initialCalendarData: CalendarData = [
    {
        date: '01-12-2024',
        dayOfWeek: 'Sun',
        schedule: {
            activities: [
                {
                    id: 'activity-1',
                    title: 'Morning routine',
                    description: 'Attending a lecture on macroeconomic principles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
                {
                    id: 'activity-2',
                    title: 'Economics Lecture',
                    description: 'Attending a lecture on macroeconomic principles.',
                    type: 'activity',
                    startTime: '9:00 AM',
                    endTime: '10:30 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-3',
                    title: 'Math Problem Solving',
                    description: 'Solving calculus problems for upcoming exams.',
                    type: 'activity',
                    startTime: '11:00 AM',
                    endTime: '12:15 PM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 75,
                },
                {
                    id: 'activity-4',
                    title: 'History Reading',
                    description: 'Reading chapters on World War II from the history book.',
                    type: 'activity',
                    startTime: '2:00 PM',
                    endTime: '3:30 PM',
                    style: {
                        backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                        textColor: 'text-red-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-5',
                    title: 'Psychology Research',
                    description: 'Researching behavioral psychology for project work.',
                    type: 'activity',
                    startTime: '4:00 PM',
                    endTime: '6:00 PM',
                    style: {
                        backgroundColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
                        textColor: 'text-yellow-600',
                    },
                    duration: 120,
                },
                {
                    id: 'activity-6',
                    title: 'Economics Case Study',
                    description: 'Analyzing a case study on global trade policies.',
                    type: 'activity',
                    startTime: '6:30 PM',
                    endTime: '7:45 PM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 75,
                },
                {
                    id: 'activity-7',
                    title: 'Math Quiz Preparation',
                    description: 'Revising formulas and practice problems for the quiz.',
                    type: 'activity',
                    startTime: '8:00 PM',
                    endTime: '9:15 PM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 75,
                },
                {
                    id: 'activity-8',
                    title: 'Historical Article Review',
                    description: 'Reviewing a historical article on medieval architecture.',
                    type: 'activity',
                    startTime: '9:30 PM',
                    endTime: '10:30 PM',
                    style: {
                        backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                        textColor: 'text-red-600',
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
            activities: [
                {
                    id: 'activity-9',
                    title: 'Morning Routine',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
                {
                    id: 'activity-10',
                    title: 'Morning Economics Brief',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '8:00 AM',
                    endTime: '9:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 60,
                },
                {
                    id: 'activity-11',
                    title: 'Math Practice Session',
                    description: 'Practicing advanced calculus problems for upcoming assessments.',
                    type: 'activity',
                    startTime: '9:30 AM',
                    endTime: '11:00 AM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-12',
                    title: 'Historical Research',
                    description: 'Conducting research on Renaissance art and culture.',
                    type: 'activity',
                    startTime: '11:30 AM',
                    endTime: '1:00 PM',
                    style: {
                        backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                        textColor: 'text-red-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-13',
                    title: 'Psychology Workshop',
                    description: 'Attending an interactive workshop on cognitive biases.',
                    type: 'activity',
                    startTime: '2:00 PM',
                    endTime: '4:00 PM',
                    style: {
                        backgroundColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
                        textColor: 'text-yellow-600',
                    },
                    duration: 120,
                },
                {
                    id: 'activity-14',
                    title: 'Economic Policy Discussion',
                    description: 'Participating in a group discussion on global economic policies.',
                    type: 'activity',
                    startTime: '4:30 PM',
                    endTime: '5:30 PM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 60,
                },
                {
                    id: 'activity-15',
                    title: 'Math Quiz Review',
                    description: 'Reviewing answers from a previous quiz to identify areas for improvement.',
                    type: 'activity',
                    startTime: '6:00 PM',
                    endTime: '7:00 PM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 60,
                },
            ],
            tasks: [
                {
                    id: 'task-1',
                    title: 'Prepare for Meeting',
                    description: 'Gather notes and slides for tomorrow’s meeting.',
                    type: 'task',
                    dueTime: '3:00 PM',
                    status: 'pending',
                },
                {
                    id: 'task-2',
                    title: 'Submit Homework',
                    description: 'Submit the psychology project assignment.',
                    type: 'task',
                    dueTime: '5:00 PM',
                    status: 'pending',
                },
            ],
        },
    },
    {
        date: '03-12-2024',
        dayOfWeek: 'Tue',
        schedule: {
            activities: [
                {
                    id: 'activity-16',
                    title: 'Morning Routine',
                    description: 'Performing a case study analysis on market dynamics.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
                {
                    id: 'activity-17',
                    title: 'Economic Analysis Practice',
                    description: 'Performing a case study analysis on market dynamics.',
                    type: 'activity',
                    startTime: '8:30 AM',
                    endTime: '10:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-18',
                    title: 'Math Group Study',
                    description: 'Collaborating with peers to solve algebraic problems.',
                    type: 'activity',
                    startTime: '10:30 AM',
                    endTime: '12:00 PM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-19',
                    title: 'History Presentation Prep',
                    description: 'Preparing slides for a presentation on the Industrial Revolution.',
                    type: 'activity',
                    startTime: '1:00 PM',
                    endTime: '2:30 PM',
                    style: {
                        backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                        textColor: 'text-red-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-20',
                    title: 'Psychology Book Reading',
                    description: 'Reading a chapter on social psychology theories.',
                    type: 'activity',
                    startTime: '3:00 PM',
                    endTime: '4:15 PM',
                    style: {
                        backgroundColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
                        textColor: 'text-yellow-600',
                    },
                    duration: 75,
                },
                {
                    id: 'activity-21',
                    title: 'Economics Strategy Meeting',
                    description: 'Joining a team meeting to brainstorm investment strategies.',
                    type: 'activity',
                    startTime: '5:00 PM',
                    endTime: '6:30 PM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 90,
                },
            ],
            tasks: [
                {
                    id: 'task-1',
                    title: 'Submit Research Paper',
                    description: 'Submit the finalized research paper on historical events.',
                    type: 'task',
                    dueTime: '2:00 PM',
                    status: 'pending',
                },
                {
                    id: 'task-2',
                    title: 'Email Professor',
                    description: 'Send an email to the professor regarding project feedback.',
                    type: 'task',
                    dueTime: '3:30 PM',
                    status: 'pending',
                },
                {
                    id: 'task-3',
                    title: 'Prepare Quiz Notes',
                    description: 'Organize notes for the upcoming psychology quiz.',
                    type: 'task',
                    dueTime: '6:00 PM',
                    status: 'pending',
                },
            ],
        },
    },
    {
        date: '04-12-2024',
        dayOfWeek: 'Wed',
        schedule: {
            activities: [
                {
                    id: 'activity-22',
                    title: 'Morning Routine',
                    description: 'Performing a case study analysis on market dynamics.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
                {
                    id: 'activity-23',
                    title: 'Global Economics Trends',
                    description: 'Analyzing current trends in the global economy.',
                    type: 'activity',
                    startTime: '8:30 AM',
                    endTime: '9:45 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 75,
                },
                {
                    id: 'activity-24',
                    title: 'Math Equation Workshop',
                    description: 'Participating in a workshop on solving complex equations.',
                    type: 'activity',
                    startTime: '10:15 AM',
                    endTime: '11:45 AM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-25',
                    title: 'History Documentary Viewing',
                    description: 'Watching a documentary on Ancient Egyptian Civilization.',
                    type: 'activity',
                    startTime: '1:00 PM',
                    endTime: '2:30 PM',
                    style: {
                        backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                        textColor: 'text-red-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-26',
                    title: 'Psychology Experiment Analysis',
                    description: 'Analyzing data from a psychological experiment for research.',
                    type: 'activity',
                    startTime: '3:00 PM',
                    endTime: '4:15 PM',
                    style: {
                        backgroundColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
                        textColor: 'text-yellow-600',
                    },
                    duration: 75,
                },
                {
                    id: 'activity-27',
                    title: 'Team Economics Debate',
                    description: 'Debating on the effects of monetary policies in a team setting.',
                    type: 'activity',
                    startTime: '5:00 PM',
                    endTime: '6:30 PM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 90,
                },
            ],
            tasks: [
                {
                    id: 'task-1',
                    title: 'Submit Workshop Feedback',
                    description: 'Complete the feedback form for the Math Equation Workshop.',
                    type: 'task',
                    dueTime: '12:00 PM',
                    status: 'pending',
                },
                {
                    id: 'task-2',
                    title: 'Review Experiment Results',
                    description: 'Review and document insights from the psychology experiment.',
                    type: 'task',
                    dueTime: '2:45 PM',
                    status: 'pending',
                },
                {
                    id: 'task-3',
                    title: 'Prepare Debate Notes',
                    description: 'Organize key points for the economics debate.',
                    type: 'task',
                    dueTime: '4:00 PM',
                    status: 'pending',
                },
            ],
        },
    },
    {
        date: '05-12-2024',
        dayOfWeek: 'Thu',
        schedule: {
            activities: [
                {
                    id: 'activity-28',
                    title: 'Morning Routine',
                    description: 'Performing a case study analysis on market dynamics.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
                {
                    id: 'activity-29',
                    title: 'Economics Market Simulation',
                    description: 'Participating in a simulated trading market exercise.',
                    type: 'activity',
                    startTime: '8:00 AM',
                    endTime: '9:30 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-30',
                    title: 'Advanced Math Techniques',
                    description: 'Studying advanced techniques for solving integration problems.',
                    type: 'activity',
                    startTime: '10:00 AM',
                    endTime: '11:30 AM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-31',
                    title: 'Historical Novel Discussion',
                    description: 'Discussing themes from a historical novel in a reading group.',
                    type: 'activity',
                    startTime: '1:00 PM',
                    endTime: '2:30 PM',
                    style: {
                        backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                        textColor: 'text-red-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-32',
                    title: 'Psychology Case Study Review',
                    description: 'Reviewing a real-life case study in behavioral psychology.',
                    type: 'activity',
                    startTime: '3:00 PM',
                    endTime: '4:30 PM',
                    style: {
                        backgroundColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
                        textColor: 'text-yellow-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-33',
                    title: 'Economics Policy Discussion',
                    description: 'Debating recent government economic policies with peers.',
                    type: 'activity',
                    startTime: '5:00 PM',
                    endTime: '6:30 PM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 90,
                },
            ],
            tasks: [
                {
                    id: 'task-1',
                    title: 'Complete Simulation Report',
                    description: 'Write and submit a report summarizing market simulation results.',
                    type: 'task',
                    dueTime: '12:00 PM',
                    status: 'pending',
                },
                {
                    id: 'task-2',
                    title: 'Review Math Notes',
                    description: 'Revise notes from the advanced math techniques session.',
                    type: 'task',
                    dueTime: '3:00 PM',
                    status: 'pending',
                },
                {
                    id: 'task-3',
                    title: 'Submit Reading Group Feedback',
                    description: 'Provide feedback on the historical novel discussion session.',
                    type: 'task',
                    dueTime: '4:45 PM',
                    status: 'pending',
                },
            ],
        },
    },
    {
        date: '06-12-2024',
        dayOfWeek: 'Fri',
        schedule: {
            activities: [
                {
                    id: 'activity-34',
                    title: 'Morning Routine',
                    description: 'Performing a case study analysis on market dynamics.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
                {
                    id: 'activity-35',
                    title: 'Economics Startup Pitch',
                    description: 'Creating and presenting a mock business pitch for a startup idea.',
                    type: 'activity',
                    startTime: '8:00 AM',
                    endTime: '9:30 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-36',
                    title: 'Collaborative Math Puzzle Solving',
                    description: 'Working in teams to solve challenging math puzzles.',
                    type: 'activity',
                    startTime: '10:00 AM',
                    endTime: '11:15 AM',
                    style: {
                        backgroundColor: 'bg-blue-100 border-l-[5px] border-l-blue-600',
                        textColor: 'text-blue-600',
                    },
                    duration: 75,
                },
                {
                    id: 'activity-37',
                    title: 'History Artifact Analysis',
                    description: 'Analyzing ancient artifacts and discussing their historical significance.',
                    type: 'activity',
                    startTime: '1:00 PM',
                    endTime: '2:30 PM',
                    style: {
                        backgroundColor: 'bg-red-100 border-l-[5px] border-l-red-600',
                        textColor: 'text-red-600',
                    },
                    duration: 90,
                },
                {
                    id: 'activity-38',
                    title: 'Psychology Role Play',
                    description: 'Role-playing various scenarios to understand psychological concepts.',
                    type: 'activity',
                    startTime: '3:00 PM',
                    endTime: '4:15 PM',
                    style: {
                        backgroundColor: 'bg-yellow-100 border-l-[5px] border-l-yellow-600',
                        textColor: 'text-yellow-600',
                    },
                    duration: 75,
                },
                {
                    id: 'activity-39',
                    title: 'Creative Writing Workshop',
                    description: 'Writing a short story inspired by historical or psychological themes.',
                    type: 'activity',
                    startTime: '4:45 PM',
                    endTime: '6:15 PM',
                    style: {
                        backgroundColor: 'bg-purple-100 border-l-[5px] border-l-purple-600',
                        textColor: 'text-purple-600',
                    },
                    duration: 90,
                },
            ],
            tasks: [
                {
                    id: 'task-1',
                    title: 'Prepare Presentation Slides',
                    description: 'Design slides for the startup pitch presentation.',
                    type: 'task',
                    dueTime: '9:45 AM',
                    status: 'pending',
                },
                {
                    id: 'task-2',
                    title: 'Submit Math Puzzle Solutions',
                    description: 'Write and upload solutions for collaborative math puzzles.',
                    type: 'task',
                    dueTime: '11:30 AM',
                    status: 'pending',
                },
                {
                    id: 'task-3',
                    title: 'Artifact Research Notes',
                    description: 'Document findings from the artifact analysis session.',
                    type: 'task',
                    dueTime: '2:45 PM',
                    status: 'pending',
                },
                {
                    id: 'task-4',
                    title: 'Write and Share Story',
                    description: 'Finalize and share the short story from the writing workshop.',
                    type: 'task',
                    dueTime: '6:30 PM',
                    status: 'pending',
                },
            ],
        },
    },
    {
        date: '07-12-2024',
        dayOfWeek: 'Sat',
        schedule: {
            activities: [

            ],
            tasks: [
                {
                    id: 'task-1',
                    title: 'Documentary Notes',
                    description: 'Write a summary of the economics documentary.',
                    type: 'task',
                    dueTime: '10:15 AM',
                    status: 'pending',
                },
                {
                    id: 'task-2',
                    title: 'Escape Room Debrief',
                    description: 'Document lessons learned from the math escape room challenge.',
                    type: 'task',
                    dueTime: '12:15 PM',
                    status: 'pending',
                },
                {
                    id: 'task-3',
                    title: 'Landmark Photos Upload',
                    description: 'Upload photos from the historical walking tour.',
                    type: 'task',
                    dueTime: '3:30 PM',
                    status: 'pending',
                },
                {
                    id: 'task-4',
                    title: 'Film Analysis Notes',
                    description: 'Draft notes on psychological themes from the film analysis.',
                    type: 'task',
                    dueTime: '5:15 PM',
                    status: 'pending',
                },
                {
                    id: 'task-5',
                    title: 'Submit Creative Story',
                    description: 'Finalize and submit the historical fiction story.',
                    type: 'task',
                    dueTime: '7:15 PM',
                    status: 'pending',
                },
            ],
        },
    },
    {
        date: '08-12-2024',
        dayOfWeek: 'Sun',
        schedule: {
            activities: [
                {
                    id: 'activity-40',
                    title: 'Morning Routine',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '09-12-2024',
        dayOfWeek: 'Mon',
        schedule: {
            activities: [
                {
                    id: 'activity-41',
                    title: 'Morning Routine',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '10-12-2024',
        dayOfWeek: 'Tue',
        schedule: {
            activities: [
                {
                    id: 'activity-42',
                    title: 'Morning Routine',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '11-12-2024',
        dayOfWeek: 'Wed',
        schedule: {
            activities: [
                {
                    id: 'activity-43',
                    title: 'Morning Routine',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '12-12-2024',
        dayOfWeek: 'Thu',
        schedule: {
            activities: [
                {
                    id: 'activity-44',
                    title: 'Morning Routine',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '13-12-2024',
        dayOfWeek: 'Fri',
        schedule: {
            activities: [
                {
                    id: 'activity-45',
                    title: 'Morning Routine',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
            ],
            tasks: [],
        },
    },
    {
        date: '14-12-2024',
        dayOfWeek: 'Sat',
        schedule: {
            activities: [
                {
                    id: 'activity-46',
                    title: 'Morning Routine',
                    description: 'Reviewing the latest economic trends and news articles.',
                    type: 'activity',
                    startTime: '6:00 AM',
                    endTime: '8:00 AM',
                    style: {
                        backgroundColor: 'bg-green-100 border-l-[5px] border-l-green-600',
                        textColor: 'text-green-600',
                    },
                    duration: 120,
                },
            ],
            tasks: [],
        },
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