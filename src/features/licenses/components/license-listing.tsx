'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LicenseTable } from './license-tables/license-table';
import { columns } from './license-tables/columns';
import { License } from '@/types/license';

interface LicenseListingProps {
  licenses: License[];
  totalItems: number;
}

export const LicenseListing: React.FC<LicenseListingProps> = ({
  licenses,
  totalItems
}) => {
  const router = useRouter();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Licenses (${totalItems})`}
          description='Manage software licenses and access control'
        />
        <div className='flex gap-2'>
          <Button onClick={() => router.push('/dashboard/licenses/assign')}>
            <Plus className='mr-2 h-4 w-4' />
            Assign License
          </Button>
          <Button onClick={() => router.push('/dashboard/licenses/new')}>
            <Plus className='mr-2 h-4 w-4' />
            Create License
          </Button>
        </div>
      </div>
      <Separator />
      <LicenseTable data={licenses} totalItems={totalItems} columns={columns} />
    </>
  );
};
