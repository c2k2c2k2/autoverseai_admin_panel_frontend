import serverAxios from '@/lib/server-axios';
import {
  LicenseType,
  LicenseTypeResponse,
  CreateLicenseTypeDto,
  FilterLicenseTypesDto,
  UpdateLicenseTypeDto,
  LicenseTypeStats
} from '@/types/license-type';

export const serverLicenseTypesApi = {
  // Get all license types with pagination and filtering
  getLicenseTypes: async (
    filters: FilterLicenseTypesDto
  ): Promise<LicenseTypeResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search && filters.search.trim())
      params.append('search', filters.search.trim());
    if (filters.sortBy && filters.sortBy.trim())
      params.append('sortBy', filters.sortBy.trim());
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.status) params.append('status', filters.status);

    const response = await serverAxios.get(
      `/license-types?${params.toString()}`
    );

    const backendData = response.data.data;
    return {
      data: backendData.data,
      total: backendData.meta.total,
      page: backendData.meta.page,
      limit: backendData.meta.limit,
      totalPages: backendData.meta.totalPages
    };
  },

  // Get license type by ID
  getLicenseType: async (id: string): Promise<LicenseType> => {
    const response = await serverAxios.get(`/license-types/${id}`);
    return response.data.data;
  },

  // Create new license type
  createLicenseType: async (
    data: CreateLicenseTypeDto
  ): Promise<LicenseType> => {
    const response = await serverAxios.post('/license-types', data);
    return response.data.data;
  },

  // Update license type
  updateLicenseType: async (
    id: string,
    data: UpdateLicenseTypeDto
  ): Promise<LicenseType> => {
    const response = await serverAxios.patch(`/license-types/${id}`, data);
    return response.data.data;
  },

  // Delete license type
  deleteLicenseType: async (id: string): Promise<void> => {
    await serverAxios.delete(`/license-types/${id}`);
  },

  // Get all active license types
  getActiveLicenseTypes: async (): Promise<LicenseType[]> => {
    const response = await serverAxios.get('/license-types/active');
    return response.data.data;
  },

  // Get license type statistics
  getLicenseTypeStats: async (): Promise<LicenseTypeStats> => {
    const response = await serverAxios.get('/license-types/stats');
    return response.data.data;
  },

  // Update license type sort order
  updateSortOrder: async (
    sortOrderData: { id: string; sortOrder: number }[]
  ): Promise<void> => {
    await serverAxios.patch('/license-types/sort-order', sortOrderData);
  },

  // Activate license type
  activateLicenseType: async (id: string): Promise<void> => {
    await serverAxios.patch(`/license-types/${id}/activate`);
  },

  // Deactivate license type
  deactivateLicenseType: async (id: string): Promise<void> => {
    await serverAxios.patch(`/license-types/${id}/deactivate`);
  }
};
