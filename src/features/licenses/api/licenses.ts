import axiosInstance from '@/lib/axios';
import {
  License,
  LicenseResponse,
  CreateLicenseDto,
  AssignLicenseDto,
  UpdateLicenseDto,
  FilterLicensesDto,
  ValidateLicenseDto,
  LicenseValidationResponse,
  LicenseStats
} from '@/types/license';

export const licensesApi = {
  // Get all licenses with pagination and filtering
  getLicenses: async (filters: FilterLicensesDto): Promise<LicenseResponse> => {
    const params = new URLSearchParams();
    // Always append page and limit as they're required
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 10).toString());
    // Only append search if it has a value (not empty string)
    if (filters.search && filters.search.trim())
      params.append('search', filters.search.trim());
    // Only append sortBy if it has a value (not empty string)
    if (filters.sortBy && filters.sortBy.trim())
      params.append('sortBy', filters.sortBy.trim());
    // Only append sortOrder if it's different from default (DESC)
    if (filters.sortOrder && filters.sortOrder !== 'DESC')
      params.append('sortOrder', filters.sortOrder);
    if (filters.status) params.append('status', filters.status);
    if (filters.licenseTypeId)
      params.append('licenseTypeId', filters.licenseTypeId);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.brandId) params.append('brandId', filters.brandId);
    if (filters.isExpired !== undefined)
      params.append('isExpired', filters.isExpired.toString());
    // Only append expiringInDays if it's a valid number between 1 and 365
    if (
      filters.expiringInDays &&
      typeof filters.expiringInDays === 'number' &&
      filters.expiringInDays >= 1 &&
      filters.expiringInDays <= 365
    ) {
      params.append('expiringInDays', filters.expiringInDays.toString());
    }
    if (filters.createdAfter)
      params.append('createdAfter', filters.createdAfter);
    if (filters.createdBefore)
      params.append('createdBefore', filters.createdBefore);
    if (filters.updatedAfter)
      params.append('updatedAfter', filters.updatedAfter);
    if (filters.updatedBefore)
      params.append('updatedBefore', filters.updatedBefore);

    const response = await axiosInstance.get(`/licenses?${params.toString()}`);
    return response.data.data;
  },

  // Get current user's licenses
  getMyLicenses: async (
    filters: FilterLicensesDto
  ): Promise<LicenseResponse> => {
    const params = new URLSearchParams();
    // Always append page and limit as they're required
    params.append('page', (filters.page || 1).toString());
    params.append('limit', (filters.limit || 10).toString());
    // Only append search if it has a value (not empty string)
    if (filters.search && filters.search.trim())
      params.append('search', filters.search.trim());
    // Only append sortBy if it has a value (not empty string)
    if (filters.sortBy && filters.sortBy.trim())
      params.append('sortBy', filters.sortBy.trim());
    // Only append sortOrder if it's different from default (DESC)
    if (filters.sortOrder && filters.sortOrder !== 'DESC')
      params.append('sortOrder', filters.sortOrder);

    const response = await axiosInstance.get(
      `/licenses/my-licenses?${params.toString()}`
    );
    return response.data.data;
  },

  // Get license statistics
  getLicenseStats: async (): Promise<LicenseStats> => {
    const response = await axiosInstance.get('/licenses/stats');
    return response.data.data;
  },

  // Get license by ID
  getLicense: async (id: string): Promise<License> => {
    const response = await axiosInstance.get(`/licenses/${id}`);
    return response.data.data;
  },

  // Create new license
  createLicense: async (data: CreateLicenseDto): Promise<License> => {
    const response = await axiosInstance.post('/licenses', data);
    return response.data.data;
  },

  // Assign license by email
  assignLicense: async (data: AssignLicenseDto): Promise<License> => {
    const response = await axiosInstance.post('/licenses/assign', data);
    return response.data.data;
  },

  // Validate license
  validateLicense: async (
    data: ValidateLicenseDto
  ): Promise<LicenseValidationResponse> => {
    const response = await axiosInstance.post('/licenses/validate', data);
    return response.data.data;
  },

  // Update license
  updateLicense: async (
    id: string,
    data: UpdateLicenseDto
  ): Promise<License> => {
    const response = await axiosInstance.patch(`/licenses/${id}`, data);
    return response.data.data;
  },

  // Activate license
  activateLicense: async (id: string): Promise<License> => {
    const response = await axiosInstance.patch(`/licenses/${id}/activate`);
    return response.data.data;
  },

  // Deactivate license
  deactivateLicense: async (id: string): Promise<License> => {
    const response = await axiosInstance.patch(`/licenses/${id}/deactivate`);
    return response.data.data;
  },

  // Suspend license
  suspendLicense: async (id: string): Promise<License> => {
    const response = await axiosInstance.patch(`/licenses/${id}/suspend`);
    return response.data.data;
  },

  // Revoke license
  revokeLicense: async (id: string): Promise<License> => {
    const response = await axiosInstance.patch(`/licenses/${id}/revoke`);
    return response.data.data;
  },

  // Delete license
  deleteLicense: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/licenses/${id}`);
  }
};
