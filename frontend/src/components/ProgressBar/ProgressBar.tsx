import React from "react";
import "./ProgressBar.css"; // Import CSS styles
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"

interface ProgressBarProps {
  completed: number;
  pending: number;
  todo: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, pending, todo }) => {
  const total = completed + pending + todo;

  const getPercentage = (value: number) => (total ? (value / total) * 100 : 0);

  return (
    <TooltipProvider>
      <div className="border progress-bar">
        {/* Completed Segment */}
        <Tooltip>
          <TooltipTrigger
            className="border-slate-700 bg-slate-200 border-r-[3px] progress-segment"
            style={{ width: `${getPercentage(completed)}%` }}
          />
          <TooltipContent>
            <p>Completed: {completed} ({Math.round(getPercentage(completed))}%)</p>
          </TooltipContent>
        </Tooltip>

        {/* Pending Segment */}
        <Tooltip>
          <TooltipTrigger
            className="border-slate-700 bg-slate-400 border-r-[3px] progress-segment"
            style={{ width: `${getPercentage(pending)}%` }}
          />
          <TooltipContent>
            <p>Pending: {pending} ({Math.round(getPercentage(pending))}%)</p>
          </TooltipContent>
        </Tooltip>

        {/* To-do Segment */}
        <Tooltip>
          <TooltipTrigger
            className="bg-slate-500 progress-segment"
            style={{ width: `${getPercentage(todo)}%` }}
          />
          <TooltipContent>
            <p>To-do: {todo} ({Math.round(getPercentage(todo))}%)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ProgressBar;
