'use client';

import { VariantTable } from './variant-tables/variant-table';
import { columns } from './variant-tables/columns';
import { Variant } from '@/types/variant';

interface VariantTableClientProps {
  data: Variant[];
  totalItems: number;
}

export function VariantTableClient({
  data,
  totalItems
}: VariantTableClientProps) {
  return (
    <VariantTable data={data || []} totalItems={totalItems} columns={columns} />
  );
}
