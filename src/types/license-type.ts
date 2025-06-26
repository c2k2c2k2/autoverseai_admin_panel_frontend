export type LicenseTypeStatus = 'active' | 'inactive' | 'deprecated';

export type PlatformType =
  | 'standalone'
  | 'meta_quest'
  | 'vision_pro'
  | 'windows'
  | 'mac'
  | 'linux'
  | 'android'
  | 'ios'
  | 'web';

export interface LicenseType {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: LicenseTypeStatus;
  supportedPlatforms: PlatformType[];
  downloadUrl?: string;
  iconUrl?: string;
  version?: string;
  maxUsers?: number | null;
  validityDays?: number | null;
  requiresActivation: boolean;
  allowMultipleDevices: boolean;
  maxDevices?: number | null;
  price?: number | null;
  currency: string;
  systemRequirements?: Record<string, any>;
  features?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LicenseTypeResponse {
  data: LicenseType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateLicenseTypeDto {
  name: string;
  code: string;
  description?: string;
  status?: LicenseTypeStatus;
  supportedPlatforms?: PlatformType[];
  downloadUrl?: string;
  iconUrl?: string;
  version?: string;
  maxUsers?: number | null;
  validityDays?: number | null;
  requiresActivation?: boolean;
  allowMultipleDevices?: boolean;
  maxDevices?: number | null;
  price?: number | null;
  currency?: string;
  systemRequirements?: Record<string, any>;
  features?: string[];
  tags?: string[];
}

export interface UpdateLicenseTypeDto {
  name?: string;
  code?: string;
  description?: string;
  status?: LicenseTypeStatus;
  supportedPlatforms?: PlatformType[];
  downloadUrl?: string;
  iconUrl?: string;
  version?: string;
  maxUsers?: number | null;
  validityDays?: number | null;
  requiresActivation?: boolean;
  allowMultipleDevices?: boolean;
  maxDevices?: number | null;
  price?: number | null;
  currency?: string;
  systemRequirements?: Record<string, any>;
  features?: string[];
  tags?: string[];
}

export interface FilterLicenseTypesDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: LicenseTypeStatus;
}

export interface LicenseTypeStats {
  total: number;
  active: number;
  inactive: number;
}
