'use client';

import { ColumnDef } from '@tanstack/react-table';
import { LicenseType } from '@/types/license-type';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil, Trash } from 'lucide-react';

export const columns: ColumnDef<LicenseType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/license-types/${row.original.id}`}
          className='hover:underline'
        >
          {row.getValue('name')}
        </Link>
      );
    }
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code' />
    )
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => row.getValue('description') || '-'
  },
  {
    accessorKey: 'version',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Version' />
    ),
    cell: ({ row }) => row.getValue('version') || '-'
  },
  {
    accessorKey: 'supportedPlatforms',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Platforms' />
    ),
    cell: ({ row }) => {
      const platforms = row.getValue('supportedPlatforms') as string[];
      return platforms?.length ? (
        <div className='flex flex-wrap gap-1'>
          {platforms.map((platform) => (
            <Badge key={platform} variant='outline' className='text-xs'>
              {platform}
            </Badge>
          ))}
        </div>
      ) : (
        '-'
      );
    }
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price');
      const currency = row.original.currency;
      return price ? `${currency} ${price}` : 'Free';
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'active'
              ? 'default'
              : status === 'deprecated'
                ? 'destructive'
                : 'secondary'
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) =>
      format(new Date(row.getValue('createdAt')), 'MMM dd, yyyy')
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const licenseType = row.original;
      return <></>; // Placeholder, actual actions handled in license-type-table-client.tsx with CellAction
    }
  }
];
