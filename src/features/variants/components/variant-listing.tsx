import { VariantTableClient } from './variant-table-client';
import { serverVariantsApi } from '../api/server-variants';
import { FilterVariantsDto } from '@/types/variant';
import { searchParamsCache } from '@/lib/searchparams';

export default async function VariantListingPage() {
  const page = searchParamsCache.get('page');
  const perPage = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('name');
  const brandId = searchParamsCache.get('brandId');
  const carId = searchParamsCache.get('carId');
  const status = searchParamsCache.get('status');
  const transmission = searchParamsCache.get('transmission');
  const driveType = searchParamsCache.get('driveType');
  const minPrice = searchParamsCache.get('minPrice');
  const maxPrice = searchParamsCache.get('maxPrice');
  const isAvailable = searchParamsCache.get('isAvailable');
  const inStock = searchParamsCache.get('inStock');

  // Validate enum values
  const validStatus =
    status &&
    ['active', 'inactive', 'discontinued', 'out_of_stock'].includes(status)
      ? (status as FilterVariantsDto['status'])
      : undefined;

  const validTransmission =
    transmission &&
    ['manual', 'automatic', 'cvt', 'dct', 'amt'].includes(transmission)
      ? (transmission as FilterVariantsDto['transmission'])
      : undefined;

  const validDriveType =
    driveType && ['fwd', 'rwd', 'awd', '4wd'].includes(driveType)
      ? (driveType as FilterVariantsDto['driveType'])
      : undefined;

  const filters: FilterVariantsDto = {
    page: page,
    limit: perPage,
    ...(search && { search }),
    ...(brandId && { brandId }),
    ...(carId && { carId }),
    ...(validStatus && { status: validStatus }),
    ...(validTransmission && { transmission: validTransmission }),
    ...(validDriveType && { driveType: validDriveType }),
    ...(minPrice && { minPrice: parseFloat(minPrice) }),
    ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
    // Only include isAvailable and inStock filters if they are explicitly set to true
    ...(isAvailable === 'true' && { isAvailable: true }),
    ...(inStock === 'true' && { inStock: true })
  };

  // Fetch variants data
  const data = await serverVariantsApi.getVariants(filters);

  return (
    <VariantTableClient data={data.data || []} totalItems={data.total || 0} />
  );
}
