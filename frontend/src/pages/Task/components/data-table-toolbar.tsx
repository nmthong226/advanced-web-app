import React, { useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Input } from 'src/components/ui/input';
import { Button } from 'src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from 'src/components/ui/dropdown-menu';
import { DataTableViewOptions } from '../components/data-table-view-options';
import { priorities, statuses } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onRowClick?: (row: TData) => void; // Add this line
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // State for Date Filter
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  // Get the date column
  const dateColumn = table.getColumn('startDate');

  // Apply date filter logic
  const applyDateFilter = () => {
    if (fromDate && toDate && dateColumn) {
      dateColumn.setFilterValue({ fromDate, toDate });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {/* Title Filter */}
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Faceted Filters */}
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')!}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn('priority') && (
            <DataTableFacetedFilter
              column={table.getColumn('priority')!}
              title="Priority"
              options={priorities}
            />
          )}
        </div>

        {/* Filter by Date Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Filter by Date
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-4 w-[280px]">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={fromDate || ''}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label className="text-sm font-medium mt-2">End Date</label>
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
        </DropdownMenu>

        {/* Reset All Filters Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* View Options */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
