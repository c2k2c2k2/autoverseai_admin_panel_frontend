import { Brand } from './brand';

export interface Car {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  brandId: string;
  brand?: Brand;
  status: 'active' | 'inactive' | 'discontinued' | 'upcoming';
  type:
    | 'sedan'
    | 'suv'
    | 'hatchback'
    | 'coupe'
    | 'convertible'
    | 'wagon'
    | 'pickup'
    | 'van'
    | 'other';
  fuelTypes: ('petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'lpg')[];
  launchYear: number;
  discontinuedYear?: number;
  startingPrice: number;
  currency: string;
  features?: string[];
  specifications?: Record<string, any>;
  isActive: boolean;
  sortOrder: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarDto {
  name: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  brandId: string;
  status?: 'active' | 'inactive' | 'discontinued' | 'upcoming';
  type?:
    | 'sedan'
    | 'suv'
    | 'hatchback'
    | 'coupe'
    | 'convertible'
    | 'wagon'
    | 'pickup'
    | 'van'
    | 'other';
  fuelTypes?: ('petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'lpg')[];
  launchYear?: number;
  startingPrice?: number;
  currency?: string;
  features?: string[];
  specifications?: Record<string, any>;
}

export interface UpdateCarDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[];
  status?: 'active' | 'inactive' | 'discontinued' | 'upcoming';
  type?:
    | 'sedan'
    | 'suv'
    | 'hatchback'
    | 'coupe'
    | 'convertible'
    | 'wagon'
    | 'pickup'
    | 'van'
    | 'other';
  fuelTypes?: ('petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'lpg')[];
  launchYear?: number;
  discontinuedYear?: number;
  startingPrice?: number;
  currency?: string;
  features?: string[];
  specifications?: Record<string, any>;
}

export interface FilterCarsDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  brandId?: string;
  status?: 'active' | 'inactive' | 'discontinued' | 'upcoming';
  type?:
    | 'sedan'
    | 'suv'
    | 'hatchback'
    | 'coupe'
    | 'convertible'
    | 'wagon'
    | 'pickup'
    | 'van'
    | 'other';
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'lpg';
  launchYear?: number;
  minPrice?: number;
  maxPrice?: number;
  createdAfter?: string;
  createdBefore?: string;
}

export interface CarResponse {
  data: Car[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CarStats {
  total: number;
  active: number;
  inactive: number;
  discontinued: number;
  upcoming: number;
  withVariants: number;
  withoutVariants: number;
  byBrand: Record<string, number>;
  byType: Record<string, number>;
  byFuelType: Record<string, number>;
}
