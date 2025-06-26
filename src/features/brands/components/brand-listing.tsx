import { searchParamsCache } from '@/lib/searchparams';
import { BrandTable } from './brand-tables/brand-table';
import { columns } from './brand-tables/columns';
import { serverBrandsApi } from '../api/server-brands';

export default async function BrandListingPage() {
  // Get search params from cache
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');

  const filters = {
    page: page || 1,
    limit: pageLimit || 10,
    ...(search && { search })
  };

  // Fetch brands data
  const data = await serverBrandsApi.getBrands(filters);

  return (
    <BrandTable data={data.data} totalItems={data.total} columns={columns} />
  );
}
