import axiosInstance from '@/lib/axios';
import {
  LicenseType,
  LicenseTypeResponse,
  CreateLicenseTypeDto,
  FilterLicenseTypesDto,
  UpdateLicenseTypeDto,
  LicenseTypeStats
} from '@/types/license-type';

export const licenseTypesApi = {
  getLicenseTypes: async (
    filters: FilterLicenseTypesDto
  ): Promise<LicenseTypeResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.status) params.append('status', filters.status);

    const response = await axiosInstance.get(
      `/license-types?${params.toString()}`
    );
    return response.data.data;
  },

  getLicenseType: async (id: string): Promise<LicenseType> => {
    const response = await axiosInstance.get(`/license-types/${id}`);
    return response.data.data;
  },

  createLicenseType: async (
    data: CreateLicenseTypeDto
  ): Promise<LicenseType> => {
    const response = await axiosInstance.post('/license-types', data);
    return response.data.data;
  },

  updateLicenseType: async (
    id: string,
    data: UpdateLicenseTypeDto
  ): Promise<LicenseType> => {
    const response = await axiosInstance.patch(`/license-types/${id}`, data);
    return response.data.data;
  },

  deleteLicenseType: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/license-types/${id}`);
  },

  getActiveLicenseTypes: async (): Promise<LicenseType[]> => {
    const response = await axiosInstance.get('/license-types/active');
    return response.data.data;
  },

  getLicenseTypeStats: async (): Promise<LicenseTypeStats> => {
    const response = await axiosInstance.get('/license-types/stats');
    return response.data.data;
  },

  updateSortOrder: async (
    sortOrderData: { id: string; sortOrder: number }[]
  ): Promise<void> => {
    await axiosInstance.patch('/license-types/sort-order', sortOrderData);
  },

  activateLicenseType: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/license-types/${id}/activate`);
  },

  deactivateLicenseType: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/license-types/${id}/deactivate`);
  }
};
