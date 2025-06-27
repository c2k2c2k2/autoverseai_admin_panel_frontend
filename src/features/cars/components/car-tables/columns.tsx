'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CellAction } from './cell-action';
import Image from 'next/image';
import { format } from 'date-fns';

export const columns: ColumnDef<Car>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({ row }) => {
      const car = row.original;
      return (
        <div className='relative h-16 w-16 overflow-hidden rounded-lg'>
          {car.imageUrl ? (
            <Image
              src={car.imageUrl}
              alt={car.name}
              fill
              className='object-cover'
              sizes='64px'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gray-100'>
              <span className='text-xs text-gray-400'>No image</span>
            </div>
          )}
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const car = row.original;
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{car.name}</span>
          {car.description && (
            <span className='text-muted-foreground line-clamp-1 text-sm'>
              {car.description}
            </span>
          )}
        </div>
      );
    },
    meta: {
      label: 'Name',
      placeholder: 'Search cars...',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Brand
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const car = row.original;
      return (
        <div className='flex items-center gap-2'>
          {car.brand?.logoUrl && (
            <div className='relative h-6 w-6 overflow-hidden rounded'>
              <Image
                src={car.brand.logoUrl}
                alt={car.brand.name}
                fill
                className='object-contain'
                sizes='24px'
              />
            </div>
          )}
          <span>{car.brand?.name || 'Unknown Brand'}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge variant='outline'>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        discontinued: 'bg-red-100 text-red-800',
        upcoming: 'bg-blue-100 text-blue-800'
      };

      return (
        <Badge
          className={statusColors[status as keyof typeof statusColors]}
          variant='secondary'
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'launchYear',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Year
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    }
  },
  {
    accessorKey: 'startingPrice',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const car = row.original;
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: car.currency || 'USD'
      });

      return (
        <div className='font-medium'>{formatter.format(car.startingPrice)}</div>
      );
    }
  },
  {
    accessorKey: 'fuelTypes',
    header: 'Fuel Types',
    cell: ({ row }) => {
      const fuelTypes = row.getValue('fuelTypes') as string[];
      return (
        <div className='flex flex-wrap gap-1'>
          {fuelTypes?.slice(0, 2).map((fuel) => (
            <Badge key={fuel} variant='outline' className='text-xs'>
              {fuel.toUpperCase()}
            </Badge>
          ))}
          {fuelTypes?.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              +{fuelTypes.length - 2}
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue('createdAt') as string;
      return <div>{format(new Date(dateValue), 'MMM dd, yyyy')}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
