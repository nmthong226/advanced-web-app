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
    accessorKey: 'label',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    cell: ({ row }) => {
      const label = labels.find(
        (label) => label.value === row.original.category,
      );
      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline" className={`${label.color} font-thin border-[1px] border-black/10`}>{label.label}</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 sm:max-w-72 md:max-w-[24rem] font-medium text-sm truncate">
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
        <div className="flex items-center w-[100px]">
          {status.icon && (
            <status.icon className="mr-2 w-4 h-4 text-muted-foreground" />
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
            <priority.icon className="mr-2 w-4 h-4 text-muted-foreground" />
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
    accessorKey: 'dueTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due to" />
    ),
    cell: ({ row }) => {
      const dueTime = row.getValue('dueTime') as string | undefined; // Get value from the row

      if (!dueTime) return 'N/A'; // Handle missing value

      const utcDate = new Date(dueTime); // Parse ISO string from database

      // Check for invalid date
      if (isNaN(utcDate.getTime())) return 'N/A';

      // Format date as "HH:mm, DD MMM"
      const formattedDueTime = utcDate.toLocaleDateString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
        hour12: false, // Use 24-hour format
        timeZone: 'UTC', // Ensure time stays as UTC
      });

      return <div className="w-[120px]">{formattedDueTime}</div>;
    },
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
  // {
  //   accessorKey: 'estimatedTime',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Es.Time" />
  //   ),
  //   cell: ({ row }) => {
  //     const estimatedTime = parseInt(row.getValue('estimatedTime'), 10);
  //     if (isNaN(estimatedTime)) {
  //       return <div className="flex justify-center items-center w-[40px]">-</div>;
  //     }

  //     let displayValue;
  //     if (estimatedTime < 24) {
  //       displayValue = `${estimatedTime}h`; // Less than 1 day in hours
  //     } else if (estimatedTime < 168) {
  //       displayValue = `${Math.ceil(estimatedTime / 24)}d`; // Between 1 day and 1 week
  //     } else {
  //       displayValue = `${Math.ceil(estimatedTime / 168)}w`; // More than 1 week
  //     }
  //     return (
  //       <div className="flex justify-center items-center w-[40px]">
  //         {displayValue === '0h' ? '-' : displayValue}
  //       </div>
  //     );
  //   },
  //   enableSorting: true,
  //   enableHiding: false,
  // },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
