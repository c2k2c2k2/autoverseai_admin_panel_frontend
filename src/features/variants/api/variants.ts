import axiosInstance from '@/lib/axios';
import {
  Variant,
  VariantResponse,
  CreateVariantDto,
  FilterVariantsDto,
  UpdateVariantDto,
  VariantStats,
  UpdateStockDto,
  UpdateVariantSortOrderDto
} from '@/types/variant';

export const variantsApi = {
  // Get all variants with pagination and filtering
  getVariants: async (filters: FilterVariantsDto): Promise<VariantResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search && filters.search.trim())
      params.append('search', filters.search.trim());
    if (filters.sortBy && filters.sortBy.trim())
      params.append('sortBy', filters.sortBy.trim());
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.brandId) params.append('brandId', filters.brandId);
    if (filters.carId) params.append('carId', filters.carId);
    if (filters.status) params.append('status', filters.status);
    if (filters.transmission)
      params.append('transmission', filters.transmission);
    if (filters.driveType) params.append('driveType', filters.driveType);
    if (filters.minPrice)
      params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice)
      params.append('maxPrice', filters.maxPrice.toString());
    if (filters.isAvailable !== undefined)
      params.append('isAvailable', filters.isAvailable.toString());
    if (filters.inStock !== undefined)
      params.append('inStock', filters.inStock.toString());
    if (filters.createdAfter)
      params.append('createdAfter', filters.createdAfter);
    if (filters.createdBefore)
      params.append('createdBefore', filters.createdBefore);

    const response = await axiosInstance.get(`/variants?${params.toString()}`);
    return response.data.data;
  },

  // Get active variants
  getActiveVariants: async (): Promise<Variant[]> => {
    const response = await axiosInstance.get('/variants/active');
    return response.data.data;
  },

  // Get variant statistics
  getVariantStats: async (): Promise<VariantStats> => {
    const response = await axiosInstance.get('/variants/stats');
    return response.data.data;
  },

  // Get variants by brand
  getVariantsByBrand: async (brandId: string): Promise<Variant[]> => {
    const response = await axiosInstance.get(`/variants/brand/${brandId}`);
    return response.data.data;
  },

  // Get variants by car
  getVariantsByCar: async (carId: string): Promise<Variant[]> => {
    const response = await axiosInstance.get(`/variants/car/${carId}`);
    return response.data.data;
  },

  // Get variant by ID
  getVariant: async (id: string): Promise<Variant> => {
    const response = await axiosInstance.get(`/variants/${id}`);
    return response.data.data;
  },

  // Create new variant
  createVariant: async (data: CreateVariantDto): Promise<Variant> => {
    const response = await axiosInstance.post('/variants', data);
    return response.data.data;
  },

  // Update variant
  updateVariant: async (
    id: string,
    data: UpdateVariantDto
  ): Promise<Variant> => {
    const response = await axiosInstance.patch(`/variants/${id}`, data);
    return response.data.data;
  },

  // Update variant sort order within car
  updateSortOrder: async (
    carId: string,
    data: UpdateVariantSortOrderDto
  ): Promise<void> => {
    await axiosInstance.patch(`/variants/car/${carId}/sort-order`, data);
  },

  // Update variant stock
  updateStock: async (id: string, data: UpdateStockDto): Promise<Variant> => {
    const response = await axiosInstance.patch(`/variants/${id}/stock`, data);
    return response.data.data;
  },

  // Activate variant
  activateVariant: async (id: string): Promise<Variant> => {
    const response = await axiosInstance.patch(`/variants/${id}/activate`);
    return response.data.data;
  },

  // Deactivate variant
  deactivateVariant: async (id: string): Promise<Variant> => {
    const response = await axiosInstance.patch(`/variants/${id}/deactivate`);
    return response.data.data;
  },

  // Discontinue variant
  discontinueVariant: async (id: string): Promise<Variant> => {
    const response = await axiosInstance.patch(`/variants/${id}/discontinue`);
    return response.data.data;
  },

  // Delete variant
  deleteVariant: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/variants/${id}`);
  }
};
