import { Brand } from './brand';
import { Car } from './car';

export interface Variant {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock';
  price: number;
  currency: string;
  discountedPrice?: number;
  engineCapacity?: string;
  horsePower?: number;
  torque?: number;
  transmission?: 'manual' | 'automatic' | 'cvt' | 'dct' | 'amt';
  driveType?: 'fwd' | 'rwd' | 'awd' | '4wd';
  fuelEfficiency?: number;
  seatingCapacity?: number;
  bootSpace?: number;
  color?: string;
  colorCode?: string;
  imageUrl?: string;
  imageUrls?: string[];
  sortOrder: number;
  isAvailable: boolean;
  stockQuantity: number;
  specifications?: Record<string, any>;
  features?: Record<string, any>;
  brandId: string;
  carId: string;
  brand?: Brand;
  car?: Car;
  createdAt: string;
  updatedAt: string;

  // Virtual properties
  isActive: boolean;
  isDiscontinued: boolean;
  displayName: string;
  effectivePrice: number;
  hasDiscount: boolean;
  discountPercentage: number;
  primaryImageUrl: string;
  inStock: boolean;
}

export interface CreateVariantDto {
  name: string;
  description?: string;
  brandId: string;
  carId: string;
  price: number;
  currency?: string;
  discountedPrice?: number;
  engineCapacity?: string;
  horsePower?: number;
  torque?: number;
  transmission?: 'manual' | 'automatic' | 'cvt' | 'dct' | 'amt';
  driveType?: 'fwd' | 'rwd' | 'awd' | '4wd';
  fuelEfficiency?: number;
  seatingCapacity?: number;
  bootSpace?: number;
  color?: string;
  colorCode?: string;
  imageUrl?: string;
  imageUrls?: string[];
  isAvailable?: boolean;
  stockQuantity?: number;
  specifications?: Record<string, any>;
  features?: Record<string, any>;
}

export interface UpdateVariantDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  discountedPrice?: number;
  engineCapacity?: string;
  horsePower?: number;
  torque?: number;
  transmission?: 'manual' | 'automatic' | 'cvt' | 'dct' | 'amt';
  driveType?: 'fwd' | 'rwd' | 'awd' | '4wd';
  fuelEfficiency?: number;
  seatingCapacity?: number;
  bootSpace?: number;
  color?: string;
  colorCode?: string;
  imageUrl?: string;
  imageUrls?: string[];
  isAvailable?: boolean;
  stockQuantity?: number;
  specifications?: Record<string, any>;
  features?: Record<string, any>;
}

export interface FilterVariantsDto {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  brandId?: string;
  carId?: string;
  status?: 'active' | 'inactive' | 'discontinued' | 'out_of_stock';
  transmission?: 'manual' | 'automatic' | 'cvt' | 'dct' | 'amt';
  driveType?: 'fwd' | 'rwd' | 'awd' | '4wd';
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  inStock?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

export interface VariantResponse {
  data: Variant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VariantStats {
  total: number;
  active: number;
  inactive: number;
  discontinued: number;
  outOfStock: number;
  available: number;
  withDiscount: number;
  byBrand: Record<string, number>;
  byCar: Record<string, number>;
  byTransmission: Record<string, number>;
  byDriveType: Record<string, number>;
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
}

export interface UpdateStockDto {
  stockQuantity: number;
}

export interface UpdateVariantSortOrderDto {
  items: { id: string; sortOrder: number }[];
}
