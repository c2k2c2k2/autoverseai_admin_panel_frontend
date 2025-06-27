'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Brand } from '@/types/brand';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { format } from 'date-fns';

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: 'logoUrl',
    header: 'LOGO',
    cell: ({ row }) => {
      const logoUrl = row.getValue('logoUrl') as string;
      return (
        <div className='relative aspect-square h-12 w-12'>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={row.getValue('name')}
              fill
              className='rounded-lg object-contain'
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = '/placeholder-brand.png';
              }}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400'>
              <Text className='h-6 w-6' />
            </div>
          )}
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => (
      <div className='font-medium'>{cell.getValue<Brand['name']>()}</div>
    ),
    meta: {
      label: 'Name',
      placeholder: 'Search brands...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'slug',
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} title='Slug' />
    ),
    cell: ({ cell }) => (
      <code className='rounded bg-gray-100 px-2 py-1 text-sm'>
        {cell.getValue<Brand['slug']>()}
      </code>
    )
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<Brand['isActive']>();
      const Icon = isActive ? CheckCircle2 : XCircle;

      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className='capitalize'
        >
          <Icon className='mr-1 h-3 w-3' />
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
      ]
    }
  },
  {
    accessorKey: 'sortOrder',
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} title='Sort Order' />
    ),
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<Brand['sortOrder']>()}</div>
    )
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION',
    cell: ({ cell }) => {
      const description = cell.getValue<Brand['description']>();
      return (
        <div className='max-w-[200px] truncate' title={description}>
          {description || '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<Brand, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ cell }) => {
      const dateValue = cell.getValue<Brand['createdAt']>();
      return <div>{format(new Date(dateValue), 'MMM dd, yyyy')}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
