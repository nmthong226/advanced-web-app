import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconExclamationCircle,
  IconStopwatch,
} from '@tabler/icons-react';

// Labels for categorizing tasks
export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
];

// Statuses for task state management
export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: IconExclamationCircle,
  },
  {
    value: 'pending',
    label: 'Pending',
    icon: IconCircle,
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    icon: IconStopwatch,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: IconCircleCheck,
  },
];

// Priorities for task urgency levels
export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
];
