import { Suspense } from 'react';
import { LicenseListing } from '@/features/licenses/components/license-listing';
import { serverLicensesApi } from '@/features/licenses/api/server-licenses';
import { FilterLicensesDto, LicenseStatus } from '@/types/license';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default async function LicensesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Await the searchParams promise
  const params = await searchParams;

  // Parse and cache search params
  searchParamsCache.parse(params);

  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const status = searchParamsCache.get('status');
  const brandId = searchParamsCache.get('brandId');

  const filters: FilterLicensesDto = {
    page: page || 1,
    limit: pageLimit || 10,
    ...(search && { search }),
    ...(status && { status: status as LicenseStatus }),
    ...(brandId && { brandId })
  };

  const response = await serverLicensesApi.getLicenses(filters);
  const key = serialize({ ...params });

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <Suspense key={key} fallback={<DataTableSkeleton columnCount={10} />}>
        <LicenseListing
          licenses={response.data}
          totalItems={response.meta.total}
        />
      </Suspense>
    </div>
  );
}
