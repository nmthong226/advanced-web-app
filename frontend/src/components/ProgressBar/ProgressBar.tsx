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
  inProgress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, pending, inProgress }) => {
  const total = completed + pending + inProgress;

  const getPercentage = (value: number) => (total ? (value / total) * 100 : 0);

  if (total === 0) {
    return <div className="border progress-bar">No tasks</div>;
  }

  return (
    <TooltipProvider>
      <div className="border progress-bar">
        {/* Completed Segment */}
        <Tooltip>
          <TooltipTrigger
            className="border-slate-700 bg-slate-200 dark:bg-indigo-200 border-r-[3px] progress-segment"
            style={{ width: `${getPercentage(completed)}%` }}
          />
          <TooltipContent>
            <p>Completed: {completed} ({Math.round(getPercentage(completed))}%)</p>
          </TooltipContent>
        </Tooltip>

        {/* In-progress Segment */}
        <Tooltip>
          <TooltipTrigger
            className="bg-slate-700 dark:bg-indigo-700 progress-segment"
            style={{ width: `${getPercentage(inProgress)}%` }}
          />
          <TooltipContent>
            <p>In-progress: {inProgress} ({Math.round(getPercentage(inProgress))}%)</p>
          </TooltipContent>
        </Tooltip>

        {/* Pending Segment */}
        <Tooltip>
          <TooltipTrigger
            className="border-slate-500 bg-slate-400 dark:bg-indigo-500 border-r-[3px] progress-segment"
            style={{ width: `${getPercentage(pending)}%` }}
          />
          <TooltipContent>
            <p>Pending: {pending} ({Math.round(getPercentage(pending))}%)</p>
          </TooltipContent>
        </Tooltip>

      </div>
    </TooltipProvider>
  );
};

export default ProgressBar;
