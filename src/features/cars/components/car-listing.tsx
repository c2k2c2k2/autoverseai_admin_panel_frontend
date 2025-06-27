import { CarTable } from './car-tables/car-table';
import { columns } from './car-tables/columns';
import { serverCarsApi } from '../api/server-cars';

interface CarListingProps {
  searchParams: {
    page?: number | null;
    perPage?: number | null;
    name?: string | null;
    brandId?: string | null;
    type?: string | null;
    status?: string | null;
    [key: string]: any;
  };
}

export default async function CarListing({ searchParams }: CarListingProps) {
  try {
    const filters = {
      page: searchParams.page ?? 1,
      limit: searchParams.perPage ?? 10,
      ...(searchParams.name && { search: searchParams.name }),
      ...(searchParams.brandId && { brandId: searchParams.brandId }),
      ...(searchParams.type && { type: searchParams.type }),
      ...(searchParams.status && { status: searchParams.status })
    };

    // Fetch cars data
    const data = await serverCarsApi.getCars(filters);

    // Ensure we have valid data
    const cars = data?.data || [];
    const totalItems = data?.total || 0;

    return <CarTable data={cars} totalItems={totalItems} columns={columns} />;
  } catch (error) {
    console.error('Error fetching cars:', error);
    // Return empty state on error
    return <CarTable data={[]} totalItems={0} columns={columns} />;
  }
}
