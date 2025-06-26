'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LicenseType } from '@/types/license-type';
import { Check, MoreHorizontal, Pencil, Power, Trash } from 'lucide-react';

interface CellActionProps {
  data: LicenseType;
  onActivate?: (licenseType: LicenseType) => void;
  onDeactivate?: (licenseType: LicenseType) => void;
  onDelete?: (licenseType: LicenseType) => void;
}

export function CellAction({
  data,
  onActivate,
  onDeactivate,
  onDelete
}: CellActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {data.status === 'active' ? (
          <DropdownMenuItem onClick={() => onDeactivate?.(data)}>
            <Power className='mr-2 h-4 w-4' />
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onActivate?.(data)}>
            <Check className='mr-2 h-4 w-4' />
            Activate
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <a href={`/dashboard/license-types/${data.id}/edit`}>
            <Pencil className='mr-2 h-4 w-4' />
            Edit
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete?.(data)}
          className='text-red-600'
        >
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
