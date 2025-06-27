'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Car } from '@/types/car';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useDataTable } from '@/hooks/use-data-table';

interface CarTableProps {
  data: Car[];
  totalItems: number;
  columns: ColumnDef<Car>[];
}

export function CarTable({ data, totalItems, columns }: CarTableProps) {
  const router = useRouter();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title={`Cars (${totalItems})`}
          description='Manage cars for your store'
        />
        <Button onClick={() => router.push('/dashboard/cars/new')}>
          <Plus className='mr-2 h-4 w-4' /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </>
  );
}
