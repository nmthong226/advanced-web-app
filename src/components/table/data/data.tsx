import { StopwatchIcon } from "@radix-ui/react-icons";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Clock } from "lucide-react";
import { TbCancel } from "react-icons/tb";

// Labels for categorizing tasks
export const labels = [
  {
    value: 'work',
    label: 'Work',
    color: 'bg-[#CDC1FF]'
  },
  {
    value: 'leisure',
    label: 'Leisure',
    color: 'bg-[#96E9C6]'
  },
  {
    value: 'personal',
    label: 'Personal',
    color: "bg-[#FDE767]"
  },
  {
    value: 'urgent',
    label: 'Urgent',
    color: 'bg-[#FF8F8F]'
  },
  {
    value: 'other',
    label: 'Other',
    color: 'bg-[#EEF2FF]'
  }
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
    icon: TbCancel
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
