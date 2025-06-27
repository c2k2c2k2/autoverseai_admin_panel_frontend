import { Brand } from './brand';
import { LicenseType } from './license-type';
import { User } from './user';

export enum LicenseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
  PENDING_ACTIVATION = 'pending_activation'
}

export interface LicenseBrand {
  id: string;
  status: string;
  activatedAt?: Date;
  expiresAt?: Date;
  accessCount: number;
  lastAccessedAt?: Date;
  brand: Brand;
}

export interface License {
  id: string;
  licenseKey: string;
  status: LicenseStatus;
  activatedAt?: Date;
  expiresAt?: Date;
  lastAccessedAt?: Date;
  accessCount: number;
  maxAccessCount: number;
  maxDevices: number;
  notes?: string;
  emailSent: boolean;
  emailSentAt?: Date;
  assignedAt?: Date;
  assignmentReason?: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  licenseType: LicenseType;
  licenseBrands: LicenseBrand[];
  isActive: boolean;
  isExpired: boolean;
  canAccess: boolean;
  daysUntilExpiry: number | null;
  displayName: string;
  brandNames: string[];
}

export interface CreateLicenseDto {
  userId: string;
  licenseTypeId: string;
  brandIds: string[];
  expiresAt?: string;
  notes?: string;
  assignmentReason?: string;
  maxAccessCount?: number;
  maxDevices?: number;
}

export interface AssignLicenseDto {
  email: string;
  licenseTypeId: string;
  brandIds: string[];
  assignmentReason?: string;
}

export interface UpdateLicenseDto {
  expiresAt?: string;
  notes?: string;
  maxAccessCount?: number;
  maxDevices?: number;
}

export interface ValidateLicenseDto {
  licenseKey: string;
  password: string;
  deviceFingerprint?: Record<string, any>;
}

export interface LicenseValidationResponse {
  valid: boolean;
  message: string;
  license?: License;
}

export interface FilterLicensesDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: LicenseStatus;
  licenseTypeId?: string;
  userId?: string;
  brandId?: string;
  isExpired?: boolean;
  expiringInDays?: number;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
}

export interface LicenseStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  suspended: number;
  revoked: number;
  expiringIn7Days: number;
  expiringIn30Days: number;
  byLicenseType: Record<string, number>;
}

export interface LicenseResponse {
  data: License[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
