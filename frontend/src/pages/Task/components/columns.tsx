import { ColumnDef } from '@tanstack/react-table';
import { Badge } from 'src/components/ui/badge';
import { Checkbox } from 'src/components/ui/checkbox';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority'),
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">{row.getValue('startDate') || 'N/A'}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const rowDate = new Date(row.getValue(columnId));
      const fromDate = new Date(filterValue?.fromDate);
      const toDate = new Date(filterValue?.toDate);

      // Debug logs for filtering logic
      console.log('Row Date:', rowDate);
      console.log('Filter From Date:', fromDate);
      console.log('Filter To Date:', toDate);

      if (!rowDate || isNaN(rowDate.getTime())) return false; // Skip invalid dates
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return true; // If no valid filter, include all

      return rowDate >= fromDate && rowDate <= toDate;
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">{row.getValue('endDate') || 'N/A'}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const rowDate = new Date(row.getValue(columnId));
      const fromDate = new Date(filterValue?.fromDate);
      const toDate = new Date(filterValue?.toDate);

      // Debug logs for filtering logic
      console.log('Row Date:', rowDate);
      console.log('Filter From Date:', fromDate);
      console.log('Filter To Date:', toDate);

      if (!rowDate || isNaN(rowDate.getTime())) return false; // Skip invalid dates
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return true; // If no valid filter, include all

      return rowDate >= fromDate && rowDate <= toDate;
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
