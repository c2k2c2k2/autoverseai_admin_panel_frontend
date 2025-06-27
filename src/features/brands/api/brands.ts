import axiosInstance from '@/lib/axios';
import {
  Brand,
  BrandResponse,
  CreateBrandDto,
  FilterBrandsDto,
  UpdateBrandDto
} from '@/types/brand';

export const brandsApi = {
  // Get all brands with pagination and filtering
  getBrands: async (filters: FilterBrandsDto): Promise<BrandResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search && filters.search.trim())
      params.append('search', filters.search.trim());
    if (filters.sortBy && filters.sortBy.trim())
      params.append('sortBy', filters.sortBy.trim());
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await axiosInstance.get(`/brands?${params.toString()}`);
    return response.data.data;
  },

  // Get active brands
  getActiveBrands: async (): Promise<Brand[]> => {
    const response = await axiosInstance.get('/brands/active');
    return response.data.data;
  },

  // Get brand by ID
  getBrand: async (id: string): Promise<Brand> => {
    const response = await axiosInstance.get(`/brands/${id}`);
    return response.data.data;
  },

  // Create new brand
  createBrand: async (data: CreateBrandDto): Promise<Brand> => {
    const response = await axiosInstance.post('/brands', data);
    return response.data.data;
  },

  // Update brand
  updateBrand: async (id: string, data: UpdateBrandDto): Promise<Brand> => {
    const response = await axiosInstance.patch(`/brands/${id}`, data);
    return response.data.data;
  },

  // Delete brand
  deleteBrand: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/brands/${id}`);
  },

  // Activate brand
  activateBrand: async (id: string): Promise<Brand> => {
    const response = await axiosInstance.patch(`/brands/${id}/activate`);
    return response.data.data;
  },

  // Deactivate brand
  deactivateBrand: async (id: string): Promise<Brand> => {
    const response = await axiosInstance.patch(`/brands/${id}/deactivate`);
    return response.data.data;
  },

  // Update sort order
  updateSortOrder: async (
    items: { id: string; sortOrder: number }[]
  ): Promise<void> => {
    await axiosInstance.patch('/brands/sort-order', { items });
  }
};
