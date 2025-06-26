'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Variant } from '@/types/variant';
import {
  Edit,
  MoreHorizontal,
  Power,
  PowerOff,
  Trash,
  Package,
  Ban,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { variantsApi } from '../../api/variants';
import { toast } from 'sonner';

interface CellActionProps {
  data: Variant;
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await variantsApi.deleteVariant(data.id);
      toast.success('Variant deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onActivate = async () => {
    try {
      setLoading(true);
      await variantsApi.activateVariant(data.id);
      toast.success('Variant activated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onDeactivate = async () => {
    try {
      setLoading(true);
      await variantsApi.deactivateVariant(data.id);
      toast.success('Variant deactivated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onDiscontinue = async () => {
    try {
      setLoading(true);
      await variantsApi.discontinueVariant(data.id);
      toast.success('Variant discontinued successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getStatusActions = () => {
    switch (data.status) {
      case 'active':
        return (
          <>
            <DropdownMenuItem onClick={onDeactivate}>
              <PowerOff className='mr-2 h-4 w-4' />
              Deactivate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDiscontinue}>
              <Ban className='mr-2 h-4 w-4' />
              Discontinue
            </DropdownMenuItem>
          </>
        );
      case 'inactive':
        return (
          <>
            <DropdownMenuItem onClick={onActivate}>
              <Power className='mr-2 h-4 w-4' />
              Activate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDiscontinue}>
              <Ban className='mr-2 h-4 w-4' />
              Discontinue
            </DropdownMenuItem>
          </>
        );
      case 'discontinued':
        return (
          <DropdownMenuItem onClick={onActivate}>
            <CheckCircle2 className='mr-2 h-4 w-4' />
            Reactivate
          </DropdownMenuItem>
        );
      default:
        return (
          <DropdownMenuItem onClick={onActivate}>
            <Power className='mr-2 h-4 w-4' />
            Activate
          </DropdownMenuItem>
        );
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/variants/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/variants/${data.id}/stock`)}
          >
            <Package className='mr-2 h-4 w-4' />
            Update Stock
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {getStatusActions()}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className='text-red-600'
          >
            <Trash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
