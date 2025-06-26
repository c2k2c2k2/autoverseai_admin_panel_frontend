'use client';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Car } from '@/types/car';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { Button } from '@/components/ui/button';

interface CarTableProps {
  data: Car[];
}

export const CarTable: React.FC<CarTableProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Cars (${data.length})`}
          description='Manage cars for your store'
        />
        <Button onClick={() => router.push('/dashboard/cars/new')}>
          <Plus className='mr-2 h-4 w-4' /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
    </>
  );
};
