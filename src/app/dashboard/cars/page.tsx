import CarListing from '@/features/cars/components/car-listing';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { Suspense } from 'react';

export default async function CarsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Await the searchParams promise
  const params = await searchParams;

  // Parse search params
  const parsedSearchParams = searchParamsCache.parse(params);

  const key = serialize({ ...params });

  return (
    <Suspense key={key} fallback={<DataTableSkeleton columnCount={10} />}>
      <CarListing searchParams={parsedSearchParams} />
    </Suspense>
  );
}
