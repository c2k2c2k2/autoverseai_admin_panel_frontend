import { LicenseTypeTableClient } from './license-type-table-client';
import { serverLicenseTypesApi } from '../api/server-license-types';
import { FilterLicenseTypesDto } from '@/types/license-type';
import { searchParamsCache } from '@/lib/searchparams';

export default async function LicenseTypeListingPage() {
  const page = searchParamsCache.get('page');
  const perPage = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('name');
  const status = searchParamsCache.get('status');

  // Validate enum values
  const validStatus =
    status && ['active', 'inactive', 'deprecated'].includes(status)
      ? (status as FilterLicenseTypesDto['status'])
      : undefined;

  const filters: FilterLicenseTypesDto = {
    page: page,
    limit: perPage,
    ...(search && { search }),
    ...(validStatus && { status: validStatus })
  };

  // Fetch license types data
  const data = await serverLicenseTypesApi.getLicenseTypes(filters);

  return (
    <LicenseTypeTableClient
      data={data.data || []}
      totalItems={data.total || 0}
    />
  );
}
