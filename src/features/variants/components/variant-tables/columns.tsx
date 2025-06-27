'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Variant } from '@/types/variant';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle, Package, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { format } from 'date-fns';

export const columns: ColumnDef<Variant>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'IMAGE',
    cell: ({ row }) => {
      const imageUrl = row.getValue('imageUrl') as string;
      const primaryImageUrl = row.original.primaryImageUrl;
      const displayImage = imageUrl || primaryImageUrl;

      return (
        <div className='relative aspect-square h-12 w-12'>
          {displayImage ? (
            <Image
              src={displayImage}
              alt={row.getValue('name')}
              fill
              className='rounded-lg object-contain'
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = '/placeholder-car.png';
              }}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400'>
              <Package className='h-6 w-6' />
            </div>
          )}
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Variant, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const variant = row.original;
      return (
        <div>
          <div className='font-medium'>{variant.name}</div>
          <div className='text-muted-foreground text-sm'>
            {variant.brand?.name} {variant.car?.name}
          </div>
        </div>
      );
    },
    meta: {
      label: 'Name',
      placeholder: 'Search variants...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: ({ column }: { column: Column<Variant, unknown> }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const variant = row.original;
      const hasDiscount = variant.hasDiscount;

      return (
        <div>
          <div
            className={`font-medium ${hasDiscount ? 'text-muted-foreground line-through' : ''}`}
          >
            {variant.currency} {variant.price.toLocaleString()}
          </div>
          {hasDiscount && (
            <div className='text-sm font-medium text-green-600'>
              {variant.currency} {variant.discountedPrice?.toLocaleString()}
              <span className='ml-1 text-xs'>
                ({variant.discountPercentage}% off)
              </span>
            </div>
          )}
        </div>
      );
    },
    meta: {
      label: 'Price',
      variant: 'range',
      icon: DollarSign
    },
    enableColumnFilter: true
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }: { column: Column<Variant, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as Variant['status'];
      const isAvailable = row.original.isAvailable;

      const getStatusColor = () => {
        if (!isAvailable) return 'destructive';
        switch (status) {
          case 'active':
            return 'default';
          case 'inactive':
            return 'secondary';
          case 'discontinued':
            return 'destructive';
          case 'out_of_stock':
            return 'outline';
          default:
            return 'secondary';
        }
      };

      const getStatusIcon = () => {
        if (!isAvailable) return XCircle;
        switch (status) {
          case 'active':
            return CheckCircle2;
          case 'inactive':
            return XCircle;
          case 'discontinued':
            return XCircle;
          case 'out_of_stock':
            return Package;
          default:
            return XCircle;
        }
      };

      const Icon = getStatusIcon();
      const displayStatus = !isAvailable
        ? 'Unavailable'
        : status.replace('_', ' ');

      return (
        <Badge variant={getStatusColor()} className='capitalize'>
          <Icon className='mr-1 h-3 w-3' />
          {displayStatus}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Discontinued', value: 'discontinued' },
        { label: 'Out of Stock', value: 'out_of_stock' }
      ]
    }
  },
  {
    id: 'transmission',
    accessorKey: 'transmission',
    header: ({ column }: { column: Column<Variant, unknown> }) => (
      <DataTableColumnHeader column={column} title='Transmission' />
    ),
    cell: ({ row }) => {
      const transmission = row.getValue(
        'transmission'
      ) as Variant['transmission'];
      return <div className='capitalize'>{transmission || '-'}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Transmission',
      variant: 'multiSelect',
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'Automatic', value: 'automatic' },
        { label: 'CVT', value: 'cvt' },
        { label: 'DCT', value: 'dct' },
        { label: 'AMT', value: 'amt' }
      ]
    }
  },
  {
    id: 'driveType',
    accessorKey: 'driveType',
    header: ({ column }: { column: Column<Variant, unknown> }) => (
      <DataTableColumnHeader column={column} title='Drive Type' />
    ),
    cell: ({ row }) => {
      const driveType = row.getValue('driveType') as Variant['driveType'];
      const displayDriveType = () => {
        switch (driveType) {
          case 'fwd':
            return 'FWD';
          case 'rwd':
            return 'RWD';
          case 'awd':
            return 'AWD';
          case '4wd':
            return '4WD';
          default:
            return '-';
        }
      };

      return (
        <div className='text-sm font-medium uppercase'>
          {displayDriveType()}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Drive Type',
      variant: 'multiSelect',
      options: [
        { label: 'Front Wheel Drive', value: 'fwd' },
        { label: 'Rear Wheel Drive', value: 'rwd' },
        { label: 'All Wheel Drive', value: 'awd' },
        { label: 'Four Wheel Drive', value: '4wd' }
      ]
    }
  },
  {
    id: 'stockQuantity',
    accessorKey: 'stockQuantity',
    header: ({ column }: { column: Column<Variant, unknown> }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
    cell: ({ row }) => {
      const stockQuantity = row.getValue('stockQuantity') as number;
      const inStock = row.original.inStock;

      return (
        <div className='text-center'>
          <div
            className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}
          >
            {stockQuantity}
          </div>
          <div className='text-muted-foreground text-xs'>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
      );
    },
    meta: {
      label: 'Stock',
      variant: 'multiSelect',
      options: [
        { label: 'In Stock', value: 'true' },
        { label: 'Out of Stock', value: 'false' }
      ]
    },
    enableColumnFilter: true
  },
  {
    id: 'specifications',
    header: 'SPECS',
    cell: ({ row }) => {
      const variant = row.original;
      return (
        <div className='text-sm'>
          {variant.engineCapacity && <div>{variant.engineCapacity}</div>}
          {variant.horsePower && <div>{variant.horsePower} HP</div>}
          {variant.fuelEfficiency && <div>{variant.fuelEfficiency} km/l</div>}
        </div>
      );
    }
  },
  {
    accessorKey: 'sortOrder',
    header: ({ column }: { column: Column<Variant, unknown> }) => (
      <DataTableColumnHeader column={column} title='Sort Order' />
    ),
    cell: ({ cell }) => (
      <div className='text-center'>{cell.getValue<Variant['sortOrder']>()}</div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<Variant, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ cell }) => {
      const dateValue = cell.getValue<Variant['createdAt']>();
      return <div>{format(new Date(dateValue), 'MMM dd, yyyy')}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
