import { useState } from 'react';
import { Column } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from 'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';

interface DataTableDateFilterProps {
  column: Column<any, any>;
  title: string;
}

export function DataTableDateFilter({
  column,
  title,
}: DataTableDateFilterProps) {
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const applyFilter = () => {
    if (fromDate && toDate) {
      column.setFilterValue({ fromDate, toDate });
    } else {
      column.setFilterValue(undefined); // Clear filter if either date is missing
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="p-4 w-[280px]">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">Start Date</label>
          <Input
            type="date"
            value={fromDate || ''}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label className="mt-2 font-medium text-sm">End Date</label>
          <Input
            type="date"
            value={toDate || ''}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFromDate(null);
              setToDate(null);
              column.setFilterValue(undefined); // Reset filter
            }}
          >
            Reset
          </Button>
          <Button variant="default" size="sm" onClick={applyFilter}>
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
