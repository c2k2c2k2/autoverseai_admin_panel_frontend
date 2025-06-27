'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
  Shield,
  ShieldOff,
  Pause,
  Ban,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modal/alert-modal';
import { License, LicenseStatus } from '@/types/license';
import { licensesApi } from '@/features/licenses/api/licenses';

interface CellActionProps {
  data: License;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.licenseKey);
    toast.success('License key copied to clipboard');
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await licensesApi.deleteLicense(data.id);
      toast.success('License deleted');
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
      await licensesApi.activateLicense(data.id);
      toast.success('License activated');
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
      await licensesApi.deactivateLicense(data.id);
      toast.success('License deactivated');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onSuspend = async () => {
    try {
      setLoading(true);
      await licensesApi.suspendLicense(data.id);
      toast.success('License suspended');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onRevoke = async () => {
    try {
      setLoading(true);
      await licensesApi.revokeLicense(data.id);
      toast.success('License revoked');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
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
          <DropdownMenuItem onClick={onCopy}>
            <Copy className='mr-2 h-4 w-4' />
            Copy License Key
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/licenses/${data.id}`)}
          >
            <Edit className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
          {data.status === LicenseStatus.PENDING_ACTIVATION && (
            <DropdownMenuItem onClick={onActivate}>
              <CheckCircle className='mr-2 h-4 w-4' />
              Activate
            </DropdownMenuItem>
          )}
          {data.status === LicenseStatus.ACTIVE && (
            <>
              <DropdownMenuItem onClick={onDeactivate}>
                <ShieldOff className='mr-2 h-4 w-4' />
                Deactivate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSuspend}>
                <Pause className='mr-2 h-4 w-4' />
                Suspend
              </DropdownMenuItem>
            </>
          )}
          {(data.status === LicenseStatus.INACTIVE ||
            data.status === LicenseStatus.SUSPENDED) && (
            <DropdownMenuItem onClick={onActivate}>
              <Shield className='mr-2 h-4 w-4' />
              Activate
            </DropdownMenuItem>
          )}
          {data.status !== LicenseStatus.REVOKED && (
            <DropdownMenuItem onClick={onRevoke} className='text-red-600'>
              <Ban className='mr-2 h-4 w-4' />
              Revoke
            </DropdownMenuItem>
          )}
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
};
