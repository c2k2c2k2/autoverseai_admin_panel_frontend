import serverAxios from '@/lib/server-axios';
import {
  Car,
  CarResponse,
  CarStats,
  CreateCarDto,
  FilterCarsDto,
  UpdateCarDto
} from '@/types/car';

export const serverCarsApi = {
  // Get all cars with pagination and filtering
  getCars: async (filters: FilterCarsDto): Promise<CarResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.brandId) params.append('brandId', filters.brandId);
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.fuelType) params.append('fuelType', filters.fuelType);
    if (filters.launchYear)
      params.append('launchYear', filters.launchYear.toString());
    if (filters.minPrice)
      params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice)
      params.append('maxPrice', filters.maxPrice.toString());
    if (filters.createdAfter)
      params.append('createdAfter', filters.createdAfter);
    if (filters.createdBefore)
      params.append('createdBefore', filters.createdBefore);

    const response = await serverAxios.get(`/cars?${params.toString()}`);
    return response.data;
  },

  // Get active cars
  getActiveCars: async (): Promise<Car[]> => {
    const response = await serverAxios.get('/cars/active');
    return response.data;
  },

  // Get cars by brand
  getCarsByBrand: async (brandId: string): Promise<Car[]> => {
    const response = await serverAxios.get(`/brands/${brandId}/cars`);
    return response.data;
  },

  // Get car by ID
  getCar: async (id: string): Promise<Car> => {
    const response = await serverAxios.get(`/cars/${id}`);
    return response.data.data;
  },

  // Get car by slug
  getCarBySlug: async (brandSlug: string, carSlug: string): Promise<Car> => {
    const response = await serverAxios.get(
      `/cars/by-slug/${brandSlug}/${carSlug}`
    );
    return response.data;
  },

  // Create new car
  createCar: async (data: CreateCarDto): Promise<Car> => {
    const response = await serverAxios.post('/cars', data);
    return response.data;
  },

  // Update car
  updateCar: async (id: string, data: UpdateCarDto): Promise<Car> => {
    const response = await serverAxios.patch(`/cars/${id}`, data);
    return response.data;
  },

  // Delete car
  deleteCar: async (id: string): Promise<void> => {
    await serverAxios.delete(`/cars/${id}`);
  },

  // Activate car
  activateCar: async (id: string): Promise<Car> => {
    const response = await serverAxios.patch(`/cars/${id}/activate`);
    return response.data;
  },

  // Deactivate car
  deactivateCar: async (id: string): Promise<Car> => {
    const response = await serverAxios.patch(`/cars/${id}/deactivate`);
    return response.data;
  },

  // Discontinue car
  discontinueCar: async (id: string): Promise<Car> => {
    const response = await serverAxios.patch(`/cars/${id}/discontinue`);
    return response.data;
  },

  // Update sort order
  updateSortOrder: async (
    brandId: string,
    items: { id: string; sortOrder: number }[]
  ): Promise<void> => {
    await serverAxios.patch(`/brands/${brandId}/cars/sort-order`, { items });
  },

  // Get car statistics
  getStats: async (): Promise<CarStats> => {
    const response = await serverAxios.get('/cars/stats');
    return response.data;
  }
};
