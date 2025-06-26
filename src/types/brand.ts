export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  status: 'active' | 'inactive' | 'maintenance';
  primaryColor?: string;
  secondaryColor?: string;
  countryCode?: string;
  isActive: boolean;
  sortOrder: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDto {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  primaryColor?: string;
  secondaryColor?: string;
  countryCode?: string;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  primaryColor?: string;
  secondaryColor?: string;
  countryCode?: string;
}

export interface FilterBrandsDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface BrandResponse {
  data: Brand[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BrandStats {
  total: number;
  active: number;
  inactive: number;
}
