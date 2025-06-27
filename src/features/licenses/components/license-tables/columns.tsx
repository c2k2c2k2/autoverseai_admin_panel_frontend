'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { License, LicenseStatus } from '@/types/license';
import { CellAction } from './cell-action';
import { format } from 'date-fns';

const statusColors: Record<LicenseStatus, string> = {
  [LicenseStatus.ACTIVE]: 'bg-green-500',
  [LicenseStatus.INACTIVE]: 'bg-gray-500',
  [LicenseStatus.EXPIRED]: 'bg-red-500',
  [LicenseStatus.SUSPENDED]: 'bg-yellow-500',
  [LicenseStatus.REVOKED]: 'bg-red-700',
  [LicenseStatus.PENDING_ACTIVATION]: 'bg-blue-500'
};

const statusLabels: Record<LicenseStatus, string> = {
  [LicenseStatus.ACTIVE]: 'Active',
  [LicenseStatus.INACTIVE]: 'Inactive',
  [LicenseStatus.EXPIRED]: 'Expired',
  [LicenseStatus.SUSPENDED]: 'Suspended',
  [LicenseStatus.REVOKED]: 'Revoked',
  [LicenseStatus.PENDING_ACTIVATION]: 'Pending'
};

export const columns: ColumnDef<License>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'licenseKey',
    accessorKey: 'licenseKey',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='License Key' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[200px] truncate font-medium'>
            {row.getValue('licenseKey')}
          </span>
        </div>
      );
    },
    meta: {
      label: 'License Key',
      placeholder: 'Search licenses...',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'user.email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => {
      const user = row.original.user;

      // Handle case where user might be null
      if (!user) {
        return (
          <div className='flex flex-col'>
            <span className='text-muted-foreground'>No user assigned</span>
          </div>
        );
      }

      const userName = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ');
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{user.email}</span>
          {userName && (
            <span className='text-muted-foreground text-xs'>{userName}</span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'licenseType.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='License Type' />
    ),
    cell: ({ row }) => {
      return <span>{row.original.licenseType.name}</span>;
    }
  },
  {
    accessorKey: 'brandNames',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Brands' />
    ),
    cell: ({ row }) => {
      const brandNames = row.original.brandNames;
      return (
        <div className='flex flex-wrap gap-1'>
          {brandNames.map((brand, index) => (
            <Badge key={index} variant='secondary' className='text-xs'>
              {brand}
            </Badge>
          ))}
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as LicenseStatus;
      return (
        <Badge className={`${statusColors[status]} text-white`}>
          {statusLabels[status]}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'expiresAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Expires' />
    ),
    cell: ({ row }) => {
      const expiresAt = row.getValue('expiresAt') as Date | null;
      const daysUntilExpiry = row.original.daysUntilExpiry;

      if (!expiresAt) {
        return <span className='text-muted-foreground'>Never</span>;
      }

      return (
        <div className='flex flex-col'>
          <span>{format(new Date(expiresAt), 'MMM dd, yyyy')}</span>
          {daysUntilExpiry !== null && (
            <span
              className={`text-xs ${
                daysUntilExpiry <= 7
                  ? 'text-red-500'
                  : daysUntilExpiry <= 30
                    ? 'text-yellow-500'
                    : 'text-muted-foreground'
              }`}
            >
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'}
            </span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'accessCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Access Count' />
    ),
    cell: ({ row }) => {
      const accessCount = row.getValue('accessCount') as number;
      const maxAccessCount = row.original.maxAccessCount;

      return (
        <div className='flex flex-col'>
          <span>{accessCount}</span>
          {maxAccessCount > 0 && (
            <span className='text-muted-foreground text-xs'>
              of {maxAccessCount}
            </span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {format(new Date(row.getValue('createdAt')), 'MMM dd, yyyy')}
        </span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
