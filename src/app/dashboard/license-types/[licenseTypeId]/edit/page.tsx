'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { LicenseTypeForm } from '@/features/license-types/components/license-type-form';
import { licenseTypesApi } from '@/features/license-types/api/license-types';
import { LicenseType } from '@/types/license-type';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function EditLicenseTypePage() {
  const params = useParams();
  const licenseTypeId = params.licenseTypeId as string;
  const [licenseType, setLicenseType] = useState<LicenseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLicenseType = async () => {
      try {
        setLoading(true);
        const data = await licenseTypesApi.getLicenseType(licenseTypeId);
        setLicenseType(data);
      } catch (error: any) {
        console.error('Failed to fetch license type:', error);
        setError('Failed to load license type data');
        toast.error('Failed to load license type data');
      } finally {
        setLoading(false);
      }
    };

    if (licenseTypeId) {
      fetchLicenseType();
    }
  }, [licenseTypeId]);

  if (loading) {
    return (
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <Breadcrumbs />
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Edit License Type
            </h2>
            <p className='text-muted-foreground'>
              Update license type information and settings
            </p>
          </div>
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    );
  }

  if (error || !licenseType) {
    return (
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <Breadcrumbs />
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Edit License Type
            </h2>
            <p className='text-muted-foreground'>
              Update license type information and settings
            </p>
          </div>
        </div>
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>
            {error || 'License type not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <Breadcrumbs />
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Edit License Type
          </h2>
          <p className='text-muted-foreground'>
            Update license type information and settings
          </p>
        </div>
      </div>
      <LicenseTypeForm initialData={licenseType} />
    </div>
  );
}
