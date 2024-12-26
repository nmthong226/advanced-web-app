import { Cancel } from "@radix-ui/react-alert-dialog";
import { StopwatchIcon } from "@radix-ui/react-icons";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Clock } from "lucide-react";

// Labels for categorizing tasks
export const labels = [
  {
    value: 'bug',
    label: 'Bug',
    style: {
      backgroundColor: 'bg-[#2F2F31]',
      textColor: 'text-[#FFFFFF]',
    }
  },
  {
    value: 'feature',
    label: 'Feature',
    style: {
      backgroundColor: 'bg-[#2F2F31]',
      textColor: 'text-[#FFFFFF]',
    }
  },
  {
    value: 'documentation',
    label: 'Documentation',
    style: {
      backgroundColor: 'bg-[#2F2F31]',
      textColor: 'text-[#FFFFFF]',
    }
  },
];

// Statuses for task state management
export const statuses = [
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
  {
    value: 'expired',
    label: 'Expired',
    icon: Cancel
  }
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
