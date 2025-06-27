import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  // Car-specific filters
  type: parseAsString,
  // Variant-specific filters
  brandId: parseAsString,
  carId: parseAsString,
  status: parseAsString,
  transmission: parseAsString,
  driveType: parseAsString,
  minPrice: parseAsString,
  maxPrice: parseAsString,
  isAvailable: parseAsString,
  inStock: parseAsString
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
