import { ExclamationTriangleIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Clock } from "lucide-react";
import { IoArrowDownCircleOutline } from "react-icons/io5";

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
    icon: ExclamationTriangleIcon,
  },
  {
    value: 'pending',
    label: 'Pending',
    icon: Clock,
  },
  {
    value: 'in-progress',
    label: 'In Progress',
    icon: StopwatchIcon,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: CheckCircle,
  },
];

// Priorities for task urgency levels
export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUp,
  },
];
