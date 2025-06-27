export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  admins: number;
  recentSignups: number;
}

export interface LicenseStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  recentlyIssued: number;
  expiringThisMonth: number;
}

export interface CarStats {
  total: number;
  active: number;
  inactive: number;
  byBrand: Record<string, number>;
  byType: Record<string, number>;
}

export interface BrandStats {
  total: number;
  active: number;
  inactive: number;
  withCars: number;
}

export interface VariantStats {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
}

export interface LicenseTypeStats {
  total: number;
  active: number;
  inactive: number;
  mostUsed: string;
}

export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
}

export interface MonthlyTrend {
  month: string;
  users: number;
  licenses: number;
  revenue: number;
}

export interface OverviewStats {
  users: UserStats;
  licenses: LicenseStats;
  cars: CarStats;
  brands: BrandStats;
  variants: VariantStats;
  licenseTypes: LicenseTypeStats;
  revenue: RevenueStats;
  monthlyTrends: MonthlyTrend[];
}
