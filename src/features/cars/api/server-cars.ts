import { serverAxios } from '@/lib/server-axios';
import { Car } from '@/types/car';

export interface GetCarsParams {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string;
  type?: string;
  status?: string;
}

export interface GetCarsResponse {
  data: Car[];
  total: number;
  page: number;
  limit: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  path: string;
}

interface PaginatedData {
  data: Car[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const serverCarsApi = {
  getCars: async (params: GetCarsParams): Promise<GetCarsResponse> => {
    const response = await serverAxios.get<ApiResponse<PaginatedData>>(
      '/cars',
      {
        params
      }
    );

    // Extract the nested data structure
    const paginatedData = response.data.data;

    return {
      data: paginatedData.data,
      total: paginatedData.meta.total,
      page: paginatedData.meta.page,
      limit: paginatedData.meta.limit
    };
  },

  getCarById: async (id: string): Promise<Car> => {
    const response = await serverAxios.get<ApiResponse<Car>>(`/cars/${id}`);
    return response.data.data;
  }
};
