// import { useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Input } from 'src/components/ui/input';
import { Button } from 'src/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
// } from 'src/components/ui/dropdown-menu';
import { DataTableViewOptions } from '../ui/data-table-view-options';
import { priorities, statuses } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
// import { useState } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onRowClick?: (row: TData) => void; // Add this line
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // State for Date Filter

  // const [fromDate, ] = useState<string | null>(null);
  // const [toDate, ] = useState<string | null>(null);

  // Get the date column
  // const dateColumn = table.getColumn('startDate');

  // Apply date filter logic
  // const applyDateFilter = () => {
  //   if (fromDate && toDate && dateColumn) {
  //     dateColumn.setFilterValue({ fromDate, toDate });
  //   }
  // };

  return (
    <div className="flex justify-between items-center">
      <div className="flex sm:flex-row flex-col-reverse flex-1 items-start sm:items-center gap-y-2 sm:space-x-2">
        {/* Title Filter */}
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="dark:bg-slate-600 w-[150px] lg:w-[250px] h-8"
        />
        {/* Faceted Filters */}
        <div className="flex gap-x-2">
          {table.getColumn('priority') && (
            <DataTableFacetedFilter
              column={table.getColumn('priority')!}
              title="Priority"
              options={priorities}
            />
          )}
        </div>
        {/* Faceted Filters */}
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')!}
              title="Status"
              options={statuses}
            />
          )}
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Filter by Date
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
                  dateColumn?.setFilterValue(undefined); // Reset filter
                }}
              >
                Reset
              </Button>
              <Button variant="default" size="sm" onClick={applyDateFilter}>
                Apply
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu> */}
        {/* Reset All Filters Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3 h-8"
          >
            Reset
            <Cross2Icon className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>

      {/* View Options */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
