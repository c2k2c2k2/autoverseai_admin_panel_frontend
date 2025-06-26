import serverAxios from '@/lib/server-axios';
import {
  Brand,
  BrandResponse,
  CreateBrandDto,
  FilterBrandsDto,
  UpdateBrandDto
} from '@/types/brand';

export const serverBrandsApi = {
  // Get all brands with pagination and filtering
  getBrands: async (filters: FilterBrandsDto): Promise<BrandResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await serverAxios.get(`/brands?${params.toString()}`);
    return response.data.data;
  },

  // Get active brands
  getActiveBrands: async (): Promise<Brand[]> => {
    const response = await serverAxios.get('/brands/active');
    return response.data.data;
  },

  // Get brand by ID
  getBrand: async (id: string): Promise<Brand> => {
    const response = await serverAxios.get(`/brands/${id}`);
    return response.data.data;
  },

  // Get brand by slug
  getBrandBySlug: async (slug: string): Promise<Brand> => {
    const response = await serverAxios.get(`/brands/slug/${slug}`);
    return response.data.data;
  },

  // Create new brand
  createBrand: async (data: CreateBrandDto): Promise<Brand> => {
    const response = await serverAxios.post('/brands', data);
    return response.data.data;
  },

  // Update brand
  updateBrand: async (id: string, data: UpdateBrandDto): Promise<Brand> => {
    const response = await serverAxios.patch(`/brands/${id}`, data);
    return response.data.data;
  },

  // Delete brand
  deleteBrand: async (id: string): Promise<void> => {
    await serverAxios.delete(`/brands/${id}`);
  },

  // Activate brand
  activateBrand: async (id: string): Promise<Brand> => {
    const response = await serverAxios.patch(`/brands/${id}/activate`);
    return response.data.data;
  },

  // Deactivate brand
  deactivateBrand: async (id: string): Promise<Brand> => {
    const response = await serverAxios.patch(`/brands/${id}/deactivate`);
    return response.data.data;
  },

  // Update sort order
  updateSortOrder: async (
    items: { id: string; sortOrder: number }[]
  ): Promise<void> => {
    await serverAxios.patch('/brands/sort-order', { items });
  }
};
